import CrouchCancelCharacterSwitches from "@/components/moves/crouch-cancel/crouch-cancel-character-switcher";

export default function CrouchCancelCalculator() {
  return (
    <>
      <div
        className="h-16 w-full bg-red-400 dark:bg-red-700 rounded border
    border-gray-300 dark:border-gray-800 flex justify-center items-center mb-4"
      >
        <p className="text-2xl font-bold text-center">Crouch Cancel Calculator</p>
      </div>
      <h2 className="text-xl font-bold mb-2">Select a character</h2>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
        <CrouchCancelCharacterSwitches />
      </div>
    </>
  );
}
