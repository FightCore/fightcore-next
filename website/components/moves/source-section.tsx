import { Source } from '@/models/source';

export interface SourceSectionParams {
  sources: Source[];
}

export default function SourceSection(params: SourceSectionParams) {
  return (
    <div>
      <h2 className="my-3 text-xl font-bold">Sources & Credits</h2>
      <ul>
        {params.sources.map((source) => (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
