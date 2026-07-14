import { NextRequest, NextResponse } from "next/server";
import { getToolByProcessorId, type ProcessorId } from "@/config/tools";
import { processPdfJob } from "@/lib/pdf/processPdfJob";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
const MAX_FILE_COUNT = 20;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool: processorId } = await params;
  const tool = getToolByProcessorId(processorId);

  if (!tool) {
    return NextResponse.json({ error: "지원하지 않는 PDF 작업입니다." }, { status: 404 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "한 번에 업로드할 수 있는 전체 파일 크기는 4MB까지입니다." },
      { status: 413 }
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((file): file is File => file instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "작업할 파일을 업로드해 주세요." }, { status: 400 });
  }

  if (files.length > MAX_FILE_COUNT) {
    return NextResponse.json(
      { error: "한 번에 최대 20개 파일까지 처리할 수 있습니다." },
      { status: 400 }
    );
  }

  const totalFileSize = files.reduce((total, file) => total + file.size, 0);
  if (totalFileSize > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "한 번에 업로드할 수 있는 전체 파일 크기는 4MB까지입니다." },
      { status: 413 }
    );
  }

  if (!tool.multiple && files.length > 1) {
    return NextResponse.json(
      { error: "이 작업은 파일 하나만 업로드할 수 있습니다." },
      { status: 400 }
    );
  }

  try {
    const buffers = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        buffer: Buffer.from(await file.arrayBuffer())
      }))
    );

    const result = await processPdfJob({
      tool: tool.processorId as ProcessorId,
      files: buffers,
      options: Object.fromEntries(formData.entries())
    });

    return new NextResponse(new Uint8Array(result.buffer), {
      headers: {
        "content-type": result.contentType,
        "content-disposition": `attachment; filename="${result.fileName}"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "작업 처리 중 문제가 발생했습니다."
      },
      { status: 500 }
    );
  }
}
