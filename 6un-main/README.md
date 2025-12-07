# Apple Worm

Apple Worm on lihtne brauseripõhine mäng (Apple Worm / Snake stiilis), mille näidisversioon valmis kiireks prototüübiks.

## Kirjeldus
See projekt on lühikese ajaga tehtud mäng, kus juhtid ussikest, korjad õunu ja püüad jõuda väljapääsuni. Menüü kaudu saab valida tasemeid ja edusamm salvestatakse lokaalselt (lukustatud tasemed avanevad tasemete läbimisel).

## Kuidas käivitada
Ava `index.html` oma brauseris. Parim tulemuse saamiseks: avage fail HTTP serveri kaudu (mõned brauserid piiravad heli/pildite laadimist, kui kasutate `file://`). 

Üks lihtne viis: Kasuta VS Code Live Server laiendust või Netlify Drop & Deploy.

## Kontrollerid
- Noolnupud või WASD — liikumine
- `R` — taaskäivita praegune tase
- `ESC` — ava/peida menüü
- Menüüs on klahvikombinatsioonid 1–9 kiireks tasemevalikuks (ainult avatud tasemed)
- Helinupp HUD-is — lülitab heli sisse/välja (seadistus salvestatakse)

## Kuidas lähtestada salvestus
Mäng kasutab `localStorage`i tasemete avamise ja heli seade salvestamiseks. Kui tahad oma edenemise nullida:
1. Ava menüü ja kasuta nuppu "Reset progress" (kui see on lisatud)
või
2. Ava brauseri devtools → Application → Local Storage → eemalda `maxUnlockedLevel` ja `soundEnabled`

## Failid
- `index.html` — põhipaigutus
- `style.css` — stiilid ja visuaalne kujundus
- `game.js` — mängu loogika, sisendi ja menüü käsitlemine
- `assets/` — pildid ja helid (nt `apple.png`, `taust.png`, `applewormEat.mp3`)