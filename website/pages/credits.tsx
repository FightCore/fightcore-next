import { PageTitle } from '@/components/page-title';
import { Link } from '@heroui/link';

export default function Credits() {
  return (
    <>
      <PageTitle title="Credits & Sources" />

      <section className="mb-5">
        <h2 className="text-bold mt-3 mb-3 text-xl">Credits</h2>
        <p>A more detailed list of people who have been vital to this project.</p>
        <ul className="ml-7 list-disc">
          <li>
            <strong>Bort</strong>, main developer of the website.
          </li>
          <li>
            <Link href="https://bsky.app/profile/hrtfiend.bsky.social" isExternal>
              Emilia
            </Link>
            , recorder of all the GIFs and maintainer of{' '}
            <Link href="https://drive.fightcore.gg" isExternal>
              the Google Drive
            </Link>
            .
          </li>
          <li>
            <Link href="https://github.com/neilharbin0" isExternal>
              NeilHarbin0
            </Link>
            , who created frame data software allowing for background-less recording and easy editing.
          </li>
          <li>
            <Link href="https://bsky.app/profile/skullbrossbm.bsky.social" isExternal>
              skullbro
            </Link>
            , who provided insights into how to improve the crouch cancel and ASDI Down calculations.
          </li>
          <li>
            <strong>Dutch Melee Community</strong>, for their continued support and feedback.
          </li>
        </ul>
      </section>
      <section className="my-5">
        <h2 className="text-bold mb-3 text-xl">Sources</h2>
        <p>The following is a list of sources used when building FightCore.</p>
        <ul className="mt-3 ml-7 list-disc">
          <li>
            <Link href="http://meleeframedata.com" isExternal>
              MeleeFrameData
            </Link>
          </li>
          <li>
            <Link href="https://ikneedata.com" isExternal>
              IKneeData
            </Link>
          </li>
          <li>
            <Link href="https://smashboards.com/threads/detailed-throws-techs-and-getups-frame-data.206469/" isExternal>
              Detailed Throws, Techs and Getup Frame Data by Magus420
            </Link>
          </li>
          <li>
            <Link href="https://www.npmjs.com/package/@wizpanda/super-gif" isExternal>
              Wizpanda&apos;s fork of SuperGIF
            </Link>
          </li>
          <li>
            <Link href="https://melee-framedata.theshoemaker.de/" isExternal>
              The Shoemaker&apos;s Melee Frame Data
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
