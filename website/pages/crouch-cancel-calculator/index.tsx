import CrouchCancelCharacterSwitches from '@/components/moves/crouch-cancel/crouch-cancel-character-switcher';
import { PageTitle } from '@/components/page-title';

export default function CrouchCancelCalculator() {
  return (
    <>
      <PageTitle title="Crouch Cancel Calculator" />

      <h2 className="mb-5 text-xl">Select a character</h2>
      <div className="grid grid-cols-5 gap-1 md:grid-cols-10">
        <CrouchCancelCharacterSwitches />
      </div>
    </>
  );
}
