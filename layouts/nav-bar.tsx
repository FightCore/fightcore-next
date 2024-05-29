import { characters } from "@/config/framedata/framedata";
import { Logo } from "../components/icons";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Tooltip,
  Image,
  Divider,
} from "@nextui-org/react";
import React from "react";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        <NavbarBrand>
          <Logo height={50} width={200} />
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="/" size="lg">
            Characters
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="#" size="lg" isDisabled>
            Moves
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="#" size="lg" isDisabled>
            Crouch Cancel Calculator
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="https://bot.fightcore.gg" size="lg" isExternal>
            Discord Bot
          </Link>
        </NavbarMenuItem>
        <Divider></Divider>
        <div className="w-full p-2 grid grid-cols-4 gap-2">
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip content={character.name} delay={1000}>
                <Link href={"/characters/" + character.normalizedName}>
                  <Image
                    className="grow"
                    alt={character.name}
                    width={40}
                    height={40}
                    src={"/newicons/" + character.name + ".webp"}
                  />
                </Link>
              </Tooltip>
            </div>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};
