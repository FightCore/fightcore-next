"use client";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Logo } from "../components/icons";
import { characters } from "@/config/framedata/framedata";
import React from "react";
import { Socials } from "./socials";
import { SearchBar } from "./search-bar";
import {
  FaAward,
  FaCalculator,
  FaCircleUser,
  FaGoogleDrive,
  FaMugHot,
  FaRectangleList,
  FaRobot,
} from "react-icons/fa6";
import { characterRoute } from "@/utilities/routes";
import Script from "next/script";

export function SideNav() {
  return (
    <div className="h-full flex flex-col px-2 overflow-y-auto">
      <div className="flex-1">
        <div className="text-white bg-red-700 rounded-b-lg mb-2 p-1">
          <Link href="/" className="w-100 align-content-center flex">
            <Logo className="flex-1" height={50} width={100} />
          </Link>
          {process.env.IS_BETA ? <p>Beta</p> : <></>}
        </div>

        <div className="p-2 grid grid-cols-4 gap-2">
          {characters.map((character) => (
            <div key={character.normalizedName}>
              <Tooltip content={character.name} delay={1000}>
                <Link href={characterRoute(character)}>
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
        <Divider className="my-4" />

        <ul className="space-y-1 font-medium">
          <li>
            <Link
              color="foreground"
              href="/"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaCircleUser />
              <span className="ms-3">Characters</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="/crouch-cancel-calculator"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaCalculator />
              <span className="ms-3">Crouch Cancel Calculator</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="https://bot.fightcore.gg"
              isExternal
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaRobot />
              <span className="ms-3">Discord Bot</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="https://drive.fightcore.gg"
              isExternal
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaGoogleDrive />
              <span className="ms-3">Drive</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="/credits"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaAward />
              <span className="ms-3">Credits & Sources</span>
            </Link>
          </li>
          <li>
            <Link
              color="foreground"
              href="https://ko-fi.com/fc_bort"
              target="_blank"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaMugHot />
              <span className="ms-3">Buy me a coffee</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="grow"></div>
      {/* <SearchBar className="mb-2" /> */}
      <Socials className="shrink" />
      <div className="w-full text-center">
        <Link href="/patchnotes">Version 0.9</Link>
      </div>
    </div>
  );
}
