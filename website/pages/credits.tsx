import { PageTitle } from '@/components/page-title';

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
            <a
              href="https://bsky.app/profile/hrtfiend.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Emi House
            </a>
            , recorder of all the GIFs and maintainer of{' '}
            <a href="https://drive.fightcore.gg" target="_blank" rel="noopener noreferrer" className="underline">
              the Google Drive
            </a>
            .
          </li>
          <li>
            <a href="https://github.com/neilharbin0" target="_blank" rel="noopener noreferrer" className="underline">
              NeilHarbin0
            </a>
            , who created frame data software allowing for background-less recording and easy editing.
          </li>
          <li>
            <a
              href="https://bsky.app/profile/skullbrossbm.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              skullbro
            </a>
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
            <a href="http://meleeframedata.com" target="_blank" rel="noopener noreferrer" className="underline">
              MeleeFrameData
            </a>
          </li>
          <li>
            <a href="https://ikneedata.com" target="_blank" rel="noopener noreferrer" className="underline">
              IKneeData
            </a>
          </li>
          <li>
            <a
              href="https://smashboards.com/threads/detailed-throws-techs-and-getups-frame-data.206469/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Detailed Throws, Techs and Getup Frame Data by Magus420
            </a>
          </li>
          <li>
            <a
              href="https://www.npmjs.com/package/@wizpanda/super-gif"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Wizpanda&apos;s fork of SuperGIF
            </a>
          </li>
          <li>
            <a
              href="https://melee-framedata.theshoemaker.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              The Shoemaker&apos;s Melee Frame Data
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
