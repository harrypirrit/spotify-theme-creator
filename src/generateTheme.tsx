import { ThemeOptions } from "./components/ThemeOptions";

function generateIniFile(title: string, themeOptions: ThemeOptions): string {
  const { background, cards, textButtons, notifications } = themeOptions;

  return `
[${title}]
; Group 1: Background
main       = ${background || "N/A"}
nav-active = ${background || "N/A"}
sidebar    = ${background || "N/A"}
player     = ${background || "N/A"}

; Group 2: Cards
card                = ${cards || "N/A"}
shadow              = ${cards || "N/A"}
highlight           = ${cards || "N/A"}
highlight-elevated  = ${cards || "N/A"}
tab-active          = ${cards || "N/A"}
player              = ${cards || "N/A"}
main-elevated       = ${cards || "N/A"}

; Group 3: Text and Buttons
text               = ${textButtons || "N/A"}
subtext            = ${textButtons || "N/A"}
nav-active-text    = ${textButtons || "N/A"}
button             = ${textButtons || "N/A"}
button-secondary   = ${textButtons || "N/A"}
button-active      = ${textButtons || "N/A"}
play-button        = ${textButtons || "N/A"}
playback-bar       = ${textButtons || "N/A"}
main-secondary     = ${textButtons || "N/A"}
selected-row       = ${textButtons || "N/A"}

; Group 4: Notifications
notification        = ${notifications || "N/A"}
notification-error  = ${notifications || "N/A"}
heart               = ${notifications || "N/A"}
button-disabled     = ${notifications || "N/A"}
sub-button          = ${notifications || "N/A"}
main-transition     = ${notifications || "N/A"}
  `;
}

function generateCssFile(): string {
  return `
/* indicator hover colours and background -- set to notification colour*/
input:hover:not([disabled],:active)~.x-toggle-indicatorWrapper {
    background-color: var(--spice-sub-button)
}

input:checked:hover:not([disabled],:active)~.x-toggle-indicatorWrapper {
    background-color: var(--spice-sub-button)
}

/* indicator slided right button and background */
input:checked~.x-toggle-indicatorWrapper {
    background-color: var(--spice-button)
    }
    
    input:checked~.x-toggle-indicatorWrapper .x-toggle-indicator {
    background-color: var(--spice-card);
    left: auto;
    right: 2px
    }

/* indicator slided left button and background */
.x-toggle-indicatorWrapper {
        background-color: var(--spice-button)
        }

        .x-toggle-indicatorWrapper .x-toggle-indicator {
            background-color: var(--spice-card);
            }
`;
}

export function generateTheme(
  title: string,
  themeOptions: ThemeOptions
): { ini: string; css: string } {
  const iniFile = generateIniFile(title, themeOptions);
  const cssFile = generateCssFile();

  return { ini: iniFile, css: cssFile };
}
