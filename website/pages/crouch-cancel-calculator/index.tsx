import CrouchCancelCharacterSwitches from '@/components/moves/crouch-cancel/crouch-cancel-character-switcher';

export default function CrouchCancelCalculator() {
  return (
    <>
      <div className="mb-4 flex h-16 w-full items-center justify-center rounded border border-gray-300 bg-red-400 dark:border-gray-800 dark:bg-red-700">
        <p className="text-center text-2xl font-bold">Crouch Cancel Calculator</p>
      </div>
      <h2 className="mb-2 text-xl font-bold">Select a character</h2>
      <div className="grid grid-cols-5 gap-1 md:grid-cols-10">
        <CrouchCancelCharacterSwitches />
      </div>
    </>
  );
}
