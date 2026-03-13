interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl lg:text-3xl font-bold font-display">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
