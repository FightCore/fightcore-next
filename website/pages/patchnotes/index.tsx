/* eslint-disable max-len */
import { PageTitle } from '@/components/page-title';
import { Card, CardBody, CardHeader } from '@heroui/card';
import NextHead from 'next/head';

const patchNotes = [
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
