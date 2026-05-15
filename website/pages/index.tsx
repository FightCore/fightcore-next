import { CharactersHead } from '@/components/characters/characters-head';
import { useGlobalSearch } from '@/components/global-search/global-search-context';
import { Logo } from '@/components/icons';
import { PreviewVideo } from '@/components/moves/animations/preview-video';
import { FightcoreCard } from '@/components/ui/fightcore-card';
import { ShowCaseMoves } from '@/config/showcase-data';
import { siteConfig } from '@/config/site';
import { moveRoute } from '@/utilities/routes';
import { Alert, Button, Chip, InputGroup, Kbd } from '@heroui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

const DISMISS_KEY = 'fightcore-v2-banner-dismissed';

export default function Home() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) {
      setShowBanner(true);
    }
  }, []);

  function dismissBanner() {
    localStorage.setItem(DISMISS_KEY, '1');
    setShowBanner(false);
  }

  return (
    <>
      <CharactersHead />
      {showBanner && (
        <Alert color="primary" className="rounded-none border-x-0 border-t-0">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="w-full">
              <div className="flex w-full justify-between">
                <span>Welcome to Fightcore 2.0!</span>
                <Button isIconOnly size="sm" variant="outline" onPress={dismissBanner} aria-label="Close">
                  <FaXmark size={14} />
                </Button>
              </div>
            </Alert.Title>
            <Alert.Description>
              <div>
                We've reworked nearly the entire website and are working on much more. We'd love to hear your feedback.
              </div>
              <span>
                If you have any thoughts, please{' '}
                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  let us know on our Discord.
                </a>{' '}
                Or reach me directly on Discord at <code>bortthebeaver</code>
              </span>
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}
      <HeroSection />
    </>
  );
}

function HeroSection() {
  const popularMoves = ShowCaseMoves;
  const router = useRouter();
  const { isOpen, onOpen, openWithQuery } = useGlobalSearch();
  const [heroQuery, setHeroQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setHeroQuery('');
  }, [isOpen]);

  return (
    <div>
      <section className="border-divider border-b px-6 py-18">
        <div className="mx-auto flex max-w-190 flex-col items-center gap-6 text-center">
          <h1 className="text-foreground gap-3 text-5xl leading-none font-bold tracking-tighter">
            <Logo height={100} width={500} />
            <span className="mt-3 block text-3xl">
              The <span className="text-accent">best</span> source of Melee frame data.
            </span>
          </h1>

          <div className="w-full max-w-140">
            <InputGroup>
              <InputGroup.Prefix>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground-400 shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </InputGroup.Prefix>
              <InputGroup.Input
                placeholder="Search Fox shine, Marth fsmash, Jiggs rest…"
                value={heroQuery}
                onClick={() => onOpen()}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeroQuery(val);
                  openWithQuery(val);
                }}
              />
              <InputGroup.Suffix>
                <Kbd>
                  <Kbd.Abbr keyValue="command" />
                  <Kbd.Content>K</Kbd.Content>
                </Kbd>
              </InputGroup.Suffix>
            </InputGroup>

            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <span className="text-foreground-400 self-center font-mono text-xs">try:</span>
              {['fox upsmash', 'marth fsmash', 'peach dsmash', 'rest'].map((tag) => (
                <Chip className="text-muted cursor-pointer" key={tag} onClick={() => openWithQuery(tag)}>
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-3">
        <div className="pb-3">
          <h3 className="text-xl font-bold">Popular moves</h3>{' '}
          <span className="text-muted text-sm">Most viewed moves of all time.</span>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {popularMoves.map((move) => {
            return (
              <FightcoreCard key={move.character?.normalizedName + move.normalizedName}>
                <FightcoreCard.Header>
                  <FightcoreCard.Title>{move.name}</FightcoreCard.Title>
                </FightcoreCard.Header>
                <FightcoreCard.Body>
                  <PreviewVideo move={move} character={move.character!} lazy={false}></PreviewVideo>
                  <div className="grap-3 flex flex-row justify-between">
                    <div>
                      <div className="text-muted text-xs">First active</div>
                      <div className="px-1 font-mono text-sm">{move.start}</div>
                    </div>
                    <div>
                      <div className="text-muted text-xs">Last active</div>
                      <div className="px-1 font-mono text-sm">{move.end}</div>
                    </div>
                    <div>
                      <div className="text-muted text-xs">Total frames</div>
                      <div className="px-1 font-mono text-sm">{move.totalFrames}</div>
                    </div>
                  </div>
                </FightcoreCard.Body>
                <FightcoreCard.Footer>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => router.push(moveRoute(move.character!, move))}
                    onMouseDown={(e) => {
                      if (e.button === 1) {
                        e.preventDefault();
                        window.open(moveRoute(move.character!, move), '_blank');
                      }
                    }}
                  >
                    View full data
                  </Button>
                </FightcoreCard.Footer>
              </FightcoreCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
