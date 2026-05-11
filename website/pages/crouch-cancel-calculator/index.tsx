import StalenessQueue from '@/components/moves/crouch-cancel/staleness-queue';
import { PageTitle } from '@/components/page-title';
import { FightcoreCard } from '@/components/ui/fightcore-card';
import { characters } from '@/config/framedata/framedata';
import { LOCAL_STORAGE_PREFERRED_CC_FLOOR } from '@/keys/local-storage-keys';
import { CharacterBase } from '@/models/character';
import { crouchCancelCharacterRoute } from '@/utilities/routes';
import { Checkbox, Description, Label, ListBox, ListBoxItem, Select, Tabs } from '@heroui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function CrouchCancelCalculator() {
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [target, setTarget] = useState<CharacterBase | null>(null);
  const [floorPercentages, setFloorPercentages] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const flooredText = localStorage.getItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR);
      if (flooredText === null) {
        setFlooringChange(true);
        return;
      }
      setFloorPercentages(flooredText === 'true');
    }
  }, []);

  const setFlooringChange = (value: boolean) => {
    setFloorPercentages(value);
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CC_FLOOR, String(value));
  };

  function setSelectedAttacker(key: React.Key | null) {
    if (!key) return;
    const character = characters.find((c) => c.fightCoreId === Number(key));
    if (!character) return;
    let path = crouchCancelCharacterRoute(character);
    if (target) {
      path += '?target=' + target.normalizedName;
    }
    router.push(path);
  }

  function setSelectedChangeTarget(key: React.Key | null) {
    if (!key) return;
    const character = characters.find((c) => c.fightCoreId === Number(key));
    if (!character || character === target) return;
    setTarget(character);
    setSelectedTarget(character.fightCoreId);
  }

  return (
    <>
      <PageTitle title="Crouch Cancel Calculator" />

      <div className="py-3">
        <FightcoreCard>
          <FightcoreCard.Header className="w-full">
            <div className="flex w-full justify-between gap-3">
              <div className="flex-1">
                <Select
                  aria-label="Attacker"
                  className="w-full"
                  variant="secondary"
                  onSelectionChange={setSelectedAttacker}
                >
                  <Label>Attacker</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {characters.map((character) => (
                        <ListBoxItem
                          key={character.fightCoreId.toString()}
                          id={character.fightCoreId.toString()}
                          textValue={character.name}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              alt={character.name}
                              width={20}
                              height={20}
                              src={'/newicons/' + character.name + '.webp'}
                            />
                            {character.name}
                          </div>
                        </ListBoxItem>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
              <div className="place-content-center">VS</div>
              <div className="flex-1">
                <Select
                  aria-label="Target"
                  variant="secondary"
                  className="w-full"
                  selectedKey={selectedTarget ? selectedTarget.toString() : ''}
                  onSelectionChange={setSelectedChangeTarget}
                >
                  <Label>Target</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {characters.map((character) => (
                        <ListBoxItem
                          key={character.fightCoreId.toString()}
                          id={character.fightCoreId.toString()}
                          textValue={character.name}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              alt={character.name}
                              width={20}
                              height={20}
                              src={'/newicons/' + character.name + '.webp'}
                            />
                            {character.name}
                          </div>
                        </ListBoxItem>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>
          </FightcoreCard.Header>
          <FightcoreCard.Body>
            <div className="flex justify-around justify-items-center gap-3">
              <div className="">
                <div className="">Mode</div>
                <Tabs aria-label="Calculator mode" selectedKey="120">
                  <Tabs.ListContainer>
                    <Tabs.List>
                      <Tabs.Tab key="120" id="120">
                        Crouch Cancel
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab key="80" id="80">
                        ASDI Down
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>
              </div>
              <div className="">
                <div className="text-medium text-foreground-500 mb-1">Staleness</div>
                <StalenessQueue onStalenessChange={() => {}} />
              </div>
              <div className="">
                <div className="mb-1 text-sm">Ceiling percentages</div>
                <Checkbox className="dark:text-white" isSelected={floorPercentages} onChange={setFlooringChange}>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label htmlFor="feature">Floored percentages</Label>
                    <Description>11.10% will display as 12%</Description>
                  </Checkbox.Content>
                </Checkbox>
              </div>
            </div>
          </FightcoreCard.Body>
        </FightcoreCard>
      </div>
    </>
  );
}
