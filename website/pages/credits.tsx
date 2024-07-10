import { Link } from "@nextui-org/link";

export default function Credits() {
  return (
    <>
      <div
        className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded border
          border-gray-300 dark:border-gray-800 flex justify-center items-center mb-4"
      >
        <p className="text-2xl font-bold text-center">Credits & Sources</p>
      </div>
      <div className="mb-2">
        <div className="text-xl text-bold">Credits</div>
        <p>A more detailed list of people that have been vital to this project.</p>
        <ul>
          <li>
            <strong>Bort</strong> Main developer of the website
          </li>
          <li>
            <strong>Emilia</strong> Recorder of all the GIFs and maintainer of{" "}
            <Link href="https://drive.fightcore.gg">the Google Drive</Link>
          </li>
          <li>
            <strong>NeilHarbin0</strong> Creating frame data software allowing for background-less recording and easy
            editing.
          </li>
          <li>
            <strong>skullbro</strong> Providing insights in how to improve the crouch cancel and ASDI Down calculations
          </li>
          <li>
            <strong>Dutch Melee Community</strong> For their continued support and feedback
          </li>
        </ul>
      </div>
      <div>
        <div className="text-xl text-bold">Sources</div>
        <p>The following is a list of sources used when building FightCore.</p>
        <ul>
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
            <Link href="https://www.npmjs.com/package/@wizpanda/super-gif">Wizpanda&apos;s fork of SuperGIF</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
