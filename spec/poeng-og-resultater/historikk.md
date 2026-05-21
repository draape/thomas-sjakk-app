# Spillhistorikk

Det skal være mulig å vise hvilke kamper man har spilt tidligere. Her må man få informasjon om:

- Hvem man spilte mot
- Hvem som vant
- Hvor god rating bot-en har
- Når spillet skjedde

Oversikten skal vises på hjemsiden.

# Spillhistorikk

Lagrer hver fullførte kamp lokalt på enheten og viser dem på hjemskjermen.

## Hva som lagres per kamp

- Motstander (bot-navn og vanskelighetsgrad)
- Bot-rating på spilletidspunktet
- Resultat: seier, tap eller uavgjort (fra Thomas sitt perspektiv)
- Tidspunkt (ISO-timestamp)

## Når en kamp lagres

Når spillet ender i sjakk matt eller patt. Én oppføring per kamp.

## Visning på hjemskjermen

- Seksjon Spillhistorikk over rating-seksjonen
- Sortert med nyeste øverst
- Ingen begrensning på antall — listen er scrollbar
- Hver oppføring viser: bot-avatar med badge, bot-navn, rating, resultat (🏆 Seier / 💔 Tap / 🤝 Uavgjort), formatert dato (nb-NO)
- Tom tilstand: «Ingen spilte kamper ennå. Spill din første kamp!»

## Persistering

- Data lagres lokalt med AsyncStorage
- Overlever omstart av appen
- Korrupt eller manglende data håndteres som tom liste (krasjer ikke)
