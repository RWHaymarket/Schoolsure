export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-h2 font-headline text-navy">{title}</h1>
        {description ? (
          <p className="mt-3 text-body text-grey-700">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
