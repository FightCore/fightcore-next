/* eslint-disable max-len */
import { PageTitle } from '@/components/page-title';
import { Card, CardBody, CardHeader } from '@heroui/card';
import NextHead from 'next/head';

const patchNotes = [
  {
    version: '1.3.0',
    changes: [
      'Added an FPS toggle to the GIF player, allowing you to switch to real-time speed (thanks nyx for the suggestion)',
      'Added a First and Last frame button to the GIF player, allowing you to quickly jump to the start or end of the animation (thanks nyx for the suggestion)',
      'The GIF player should now be more stable on iOS devices.',
      'The Crouch Cancel table now shows the values for non-crouch cancelable moves. (thank you to the Toronto Melee community for the help)',
      'Added the knockback units to the Crouch Cancel table.',
      'Upgraded dependencies to their latest compatible versions.',
      'Change the title and description to better reflect the content (thank you to Graapefruit for the Pull Request)',
      "Added a icon to indicate that the crouch cancel also breaks Yoshi's  double jump armor (thank you to Graapefruit for the Pull Request)",
      'Added a warning about Sakurai angles and added the 32 unit table (thank you to Graapefruit for the Pull Request)',
      'A small easter egg was added to (thank you to Graapefruit for the Pull Request)',
      'Added a light gray background to the GIFs to improve visibility on light mode',
      'Fixed an issue where the section buttons clipped outside of their container on smaller screens',
      'Removed the Uncategorized table within the Crouch Cancel Calculator',
      'Changed the Crouch Cancel Calculator to show 2 columns instead of 3, improving readability',
      'Fixed an issue where the light mode background did not stretch to the full height of the page on some pages',
    ],
  },
  {
    version: '1.2.2',
    changes: [
      'Added Edge options to the navigational bar.',
      'Added a bunch of missing Roy animations created by graizel on GitLab.',
    ],
  },
  {
    version: '1.2.1',
    changes: ['Fixed the Grab hits being off by 1 frame for most characters'],
  },
  {
    version: '1.2.0',
    changes: [
      'Added a GIF download button to the GIF player, allowing you to download the GIF/WEBM/PNG of a move.',
      'Upgraded the entire website to the most up to date version of Next.js, React and other libraries, (hopefully) increasing stability and performance.',
      "Fixed an issue where Sheiks's grab and rapid jab were mixed up with data.",
    ],
  },
  {
    version: '1.1.1',
    changes: [
      "Fixed Peach's down smash being listed as ending on frame 24 instead of ending on frame 22. (thank you to CaitlynCherche and lynnpetals)",
    ],
  },
  {
    version: '1.1.0',
    changes: [
      'Added a search bar to the character page, allowing you to search for moves by name. It is currently in beta, big improvements will come down the line.',
      'Added a button bar to the character page, allowing you to quickly navigate to the categories of moves of a character.',
      'Big list of changes to the data here, thank you to skullbro for the initial report.',
      "Fixed Bowser's down air having a hitbox that doesn't exist on frame 41-42. Updated the end from frame 42 to frame 39.",
      "Fixed Bowser's down smash having a hitbox that doesn't exist on frame 33 and 35. Correctly set the finisher hit to 32 and the end to 32 as well.",
      'Fixed Captain Falcon up air having an impossible hitbox on due to a coding error in Melee.',
      'Fixed Ice Climbers up tilt having a hitbox on frame 14 that does not exist.',
      'Fixed Jigglypuff down air having a hitbox on frame 39 and 30 that does not exist.',
      'Fixed Kirby down air having hits on frame 36 and 37 that do not exist.',
      'Added a note to Kirby dash attack, the IASA frame does exist but does not show in the GIF (Melee bug).',
      'Fixed Links dashgrab stating its 11-17 but it is actuall 12-17.',
      'Fixed Links grab stating its 10-17 but its actually 11-13.',
      'Fixed Mario down air having a hitbox on frame 31-32 that does not exist. Moved the IASA frame to frame 33.',
      "Fixed Mewtwo neutral air having a hitbox that doesn't exist on frame 41-42, IASA frame has been moved to 42 instead of 45, auto cancels from frame 37.",
      'Fixed Mewtwo rapid jab timing being off by 1 frame, now stated as frame 6, 13, 20, 27, 34, 41, and 48.',
      "Fixed Mewtwo up smash having a hitbox that doesn't exist on frame 37-38.",
      "Added a note to Ness down smash due to it's IASA not being show (Melee bug).",
      "Fixed Ness forward air having a hitbox that doesn't exist on frame 22-24.",
      'Fixed Ness jab 3 hitbox being off by 1 frame, hits on frame 7-8.',
      "Fixed Peach down air having a hitbox that doesn't exist on frame 36-37. Moved the IASA frame to 36.",
      "Fixed Pichu forward air having a hitbox that doesn't exist on frame 26-28. Fixed the auto cancel to start from frame 34.",
      "Fixed Pichu forward smash having a hitbox that doesn't exist on frame 34-36.",
      "Fixed Pikachu down smash having a hitbox that doesn't on frame 25-26, moved the strong hitbox to frame 25.",
      "Fixed Pikachu forward air having a hitbox that doesn't exist on frame 26-28, moved the auto cancel to frame 34.",
      'Removed a bad note from Pikachu up air',
      "Moved Roy's down smash second hit to be frame 23-25 instead of 24-26.",
      "Fixed Roy's up smash having a hitbox that doesn't exist on frame 25-26.",
      'Fixed Samus dashgrab having wrong timing, now 18-32.',
      'Fixed Samus grab having wrong timing, now 18-37.',
      'Fixed Samus forward air having wrongly timed hits, now 4-5, 11-12, 18-19, 25-26, 32-33 (strong hit).',
      "Fixed Samus up air having a hitbox that doesn't exist on frame 23-24. Hits on 20-21 have been updated to have the correct Sakurai angle.",
      'Fixed Sheik rapid jabs being off by 1 frame.',
      'Fixed Young Link dashgrab having wrong timing, now 14-17.',
      'Fixed Young Link grab having wrong timing, now 11-14.',
      "Fixed Zelda forward smash having a hitbox that doesn't exist on frame 26, Hit 24 is the Sakurai angle.",
      "Fixed Zelda jab 1 having a hitbox that doesn't exist on frame 17.",
      "Fixed Zelda neutral air having a hitbox that doesn't exist on frame 30-31, hits on 26-27 are Sakurai angle.",
      "Fixed Zelda up smash having a hitbox that doesn't exist on frame 17 and 36, added the finisher on frame 34.",
    ],
  },
  {
    version: '1.0.3',
    changes: [
      'Fixed an issue where the crouch cancel percentage was nearly always off by 1% (thank you Emi, Faust, skullbro, beachcow and others)',
      'Added staleness to the crouch cancel calculator (thank you for the suggestion Faust)',
    ],
  },
  {
    version: '1.0.2',
    changes: [
      "Fixed an issue where Dr Mario's down air had an incorrect frame at 32-33 (thank you skullbro)",
      'Fixed an issue where Peach down smash had an incorrect last 2 frames (thank you Vlerk)',
      'Added tech roll and neutral tech GIFs by Lab @ 999, Created by Renzo and Maximus',
      "Added the timing for Sheik's bair hitboxes (Thank you smoked_em)",
      'Restyled the mobile UI to be more clean and grid based (thank you rubenb994)',
      'Restyled the desktop UI to be more focussed on the data with a cleaner look (thank you rubenb994)',
      'Updated the meta data of pages to now show data about a move on Discord and other sites.',
      'Used a different Sentry package to improve load times',
      'Updated all dependencies to the latest version',
    ],
  },
  {
    version: '1.0.1',
    changes: [
      'Fixed an issue where the hitlag for crouch canceled defender was wrong (thank you skullbro)',
      "Removed the hitlag attacked (crouched) as this doesn't apply in Melee (thank you skullbro)",
      'Fixed an issue where CC percentage was calculated as Infinite',
    ],
  },
  {
    version: '1.0',
    changes: [
      'Changed the GIF based playback by png playback, this improves quality and ease of use. GIFs will be used in case an png is not available.',
      "Changed Link's up smash IASA frame to 52 (Thank you Blubba_Pinecone)",
      "Added alternative animations. There are now numbers above moves with multiple animations, check Peach's forward smash as an example!",
      'Added 130 alternatives animations that were already recorded by Emi (thank you Emi)',
      'Added a full-screen button besides above the player, gives you a more close up view of the animation',
      'Changed the popup from clicking the GIF on the move to be full screen rather than the same size',
      'Added a note to Peach up b that closed parasol has 4 frames of landing lag',
      'All the grammar based changes suggested by CrushPoint',
      'Added a toggle to switch between 99% and Never breaks for crouch cancel values.',
      'Updated 10 of Young Links moves to have accurate data (thank you Neilharbin0)',
      'Added the ability to click on the hitbox timeline to jump to a specific frame in the player',
      'Update the right side of the move view to contain links to other relevant moves',
      'Added Sentry to track errors and performance of pages',
      'Added a sitemap to improve SEO.',
      'Removed some of the duplicate routes that nobody was using',
      'Reintroduce the hitlag for crouched defender and attacker, this was accidentally removed from 0.9',
      'Fixed an issue where the moves overview of characters would have white backgrounds on iOS devices',
    ],
  },
  {
    version: '0.9',
    changes: [
      'Changed the entire hitbox system to now be based on hits rather than hitboxes',
      'Added the hitbox timeline for relevant moves',
      'Reworked the hitbox table to show the hits and their stats',
      'Reworked the hitbox table to group similar hitboxes (Before these would show as all id0 which confused people)',
      'Updated some styling to use the deeper red within Light Mode',
      'Added Fox, Falco, Ice Climbers, Jigglypuff, Kirby and Zelda Down/Up angled forward tilt',
      'Reworked the Crouch Cancel calculator to work based on hits',
      'Massively expanded the number of hitboxes found within FightCore',
      'Reworked the naming of hitboxes, categorizing names like "Late" or "Clean" have now been moved to the hit name rather than the hitbox. You can view these as nicely split categories.',
      'Moved the Grab to the Throw category and renamed it to Grab/Throw',
      'Added the Tech, EdgeAttack, Item, and Copy Abilities categories',
      'Moves are now consistently sorted on the character page',
      'Special moves aerial versions are now next to their grounded versions within the character page',
      "Kirby's copy abilities are now sorted the same as the characters",
      "Fixed an issue where some of Female Wireframe's moves were categorized incorrectly",
      "Renamed Kirby's copy abilities to be more in line with the character names on FightCore",
      'Removed notes from moves that talk about weak/strong hitboxes as this is now visible on the site itself',
      'Added the hitbox color to the hitboxes table',
      'Merged together hits and hitboxes that are equal within the Crouch Cancel Percentages section',
      'Overhauled the hitboxes for aerial special moves, including a lot of missing hitboxes',
      'Overhauled the scripts used to generate the frame data, open sourcing the calculations even more',
    ],
  },
  {
    version: '0.8',
    changes: [
      'Fixed the way that set knockback is displayed within the crouch cancel tables',
      'Added a toggle to floor the percentages in the crouch cancel tables',
      'Added the Crouch Cancel Calculator',
      "Added a link to Emilia's drive",
      'Added credits and sources page',
      "Removed the moves link. I can't get this page how I want without paid libraries unfortunately. It might return at a later date.",
    ],
  },
  {
    version: '0.7',
    changes: [
      'Fixed the spelling of Length in Wave Dash Length Rank (thank you Troy Spencer @_CrushPoint_)',
      "Fixed a spelling mistake in Bowser's Fire Breath (thank you Troy Spencer @_CrushPoint_)",
      'Fixed some capitalization inconsistencies in tables (thank you Troy Spencer @_CrushPoint_)',
      'Marked negative percentages for CC/ASDI as impossible (thank you Troy Spencer @_CrushPoint_)',
      'Made it possible to go from the first frame to the last frame by pressing previous frame in the GIF player (thank you noon @noonvania)',
      'Changed the CC/ASDI values to show as impossible at upwards angles (thank you Skullbro @skullbro200)',
      'Added an option to sort the CC/ASDI table (thank you to vlerk @vlerkssbm)',
      'The sort option for the CC/ASDI table is now saved when you leave the page',
      'Added the option to navigate between frames with the arrow keys and space in the gif (thank you to vlerk @vlerkssbm)',
      'Fixed an issue where https://drive.fightcore.gg would not redirect to the drive',
      'Fixed an issue where Donkey Kong Down Tilt was the Jab 2 animation',
      'Changed the build process to use gzip, hopefully increasing performance a small bit',
    ],
  },
  {
    version: '0.6',
    changes: [
      'Added the social bar, patch notes and light theme to mobile',
      'Made some mobile only light mode changes',
      'Fixed an issue where the move/character name would leave its intended box on mobile',
      'Setup caching policies and other major server side performance improvements',
      'Used dynamic imports for larger libraries to lower bundle size',
      'Changed from the nextui react package to individual components to improve bundle size',
      'Added an option to locally block Umami',
      'Added a beta indicator to the navbar and sidenav',
      'Made the logo in the navbar clickable on mobile',
    ],
  },
  {
    version: '0.5',
    changes: [
      'Changed SEO info to be better',
      'Added the open source analytics of Umami (uBlock Origin blocks this. Data is open and public)',
      'Removed the scrollbar on the sidenav when its not needed.',
      'Added a restyle of the scrollbar to be more modern (does not effect Firefox)',
    ],
  },
  {
    version: '0.4',
    changes: [
      'Fixed SEO info not properly being merged (no more beautiful website text)',
      'Added the renamed Roy/Marth sideb gifs',
      'Fixed Jab 1 for select characters not having a gif',
      'Fixed all Roll Backwards not having a gif',
      'Fixed some rapid jabs not having a gif',
      'Added 44 Aerial versions of Grounded special moves that were missing them',
      "Re-added the old gifs where they didn't exist yet",
      'Added credits to both Neil and Emilia where applicable',
      'Added a warning about interpolated moves',
    ],
  },
  {
    version: '0.3',
    changes: [
      'Added SEO information to the Patch notes page',
      'Added SEO information to the Character page',
      'Implemented the Search box',
      'Added a lot of missing GIFs, there are still more to come soon (hopefully this week)',
    ],
  },
  {
    version: '0.2',
    changes: [
      "A Move GIF's frame counter now starts from 1 instead of 0",
      'Hid the Hitboxes and Crouch cancel table for moves without a hitbox',
      'Fixed the routes within the breadcrumbs to be correct',
      'Added True or False behind the Can wall jump',
      'Added a characters banner above the characters',
    ],
  },
  { version: '0.1', changes: ['Initial beta release'] },
];

export default function PatchNotesPage() {
  return (
    <>
      <NextHead>
        {/* Standard SEO tags */}
        <title>Patch notes - FightCore</title>
        <meta name="description" content="Shows off the patch notes for the FightCore website" />
        <link rel="canonical" href="https://www.fightcore.gg/patchnotes" />

        {/* Open Graph tags for Facebook and LinkedIn */}
        <meta property="og:title" content="Patch notes - FightCore" />
        <meta property="og:description" content="Shows off the patch notes for the FightCore website" />
        <meta property="og:url" content="https://www.fightcore.gg/patchnotes" />

        {/* Twitter Card tags */}
        <meta name="twitter:title" content="Patch notes - FightCore" />
        <meta name="twitter:description" content="Shows off the patch notes for the FightCore website" />
      </NextHead>
      <PageTitle title="Patch notes" />

      <div className="space-y-5">
        {patchNotes.map((patchNote) => (
          <Card key={patchNote.version} className="dark:bg-gray-800">
            <CardHeader>
              <h2 className="ml-2 text-lg font-bold">Version {patchNote.version}</h2>
            </CardHeader>
            <CardBody>
              <div className="mb-3 px-6">
                <ul className="list-disc">
                  {patchNote.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
