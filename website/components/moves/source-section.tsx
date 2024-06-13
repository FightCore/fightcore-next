import { Source } from "@/models/source";
import { Link } from "@nextui-org/link";

export interface SourceSectionParams {
  sources: Source[];
}

export default function SourceSection(params: SourceSectionParams) {
  return (
    <div>
      <h2 className="text-xl font-bold">Sources & Credits</h2>
      <ul>
        {params.sources.map((source) => (
          <li key={source.id}>
            <Link href={source.url} isExternal>
              {source.name}
            </Link>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
}
