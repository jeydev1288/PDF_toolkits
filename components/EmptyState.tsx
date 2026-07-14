import { Inbox, type LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="state-icon">
        <Icon size={22} aria-hidden="true" />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
