# Live rating

Ratingen til spilleren skal beregnes fra spillhistorikken, ikke lagres uavhengig. To verdier vises på hjemskjermen:

- **Nåværende rating**: ratingen etter siste fullførte kamp
- **Rekord-rating**: høyeste verdi nåværende rating noensinne har hatt

Ved hver lesning beregnes begge ved å spille av historikken fra eldst til nyest gjennom algoritmen under.

## Algoritme

Standard Elo med justert K-faktor.

### Startverdi

```
START_RATING = 1000
```

Hvis historikken er tom, vises - for både nåværende og rekord.

### Forventet score

For en kamp mot en bot med rating `R_bot` og spiller-rating `R_p`:

```
E = 1 / (1 + 10^((R_bot - R_p) / 400))
```

### Faktisk score

| Resultat | S   |
| -------- | --- |
| Seier    | 1   |
| Uavgjort | 0.5 |
| Tap      | 0   |

### Oppdatering

```
R_p' = R_p + K * (S - E)
```

Resultatet rundes til nærmeste heltall etter hver kamp.

### K-faktor

For å la nye spillere bevege seg raskt og stabilisere seg etter hvert:

```
K = 40   hvis antall fullførte kamper så langt < 20
K = 20   ellers
```

«Antall fullførte kamper så langt» telles før kampen som beregnes (dvs. de 20 første kampene bruker `K = 40`).

### Gulv

```
R_p' = max(R_p', 100)
```

Forhindrer at ratingen kan gå negativ etter mange tap.

## Beregning av rekord-rating

Underveis i avspillingen av historikken holdes en `peak`-variabel:

```
peak = max(peak, R_p')
```

Etter siste kamp returneres `{ current: R_p, peak }`.

## Eksempel

Tom historikk → `{ current: null, peak: null }`.

Første kamp: spilleren (1000) vinner mot EasyBot 1000 (1200).

- `E = 1 / (1 + 10^((1200 - 1000) / 400)) ≈ 0.240`
- `K = 40` (færre enn 20 kamper)
- `R_p' = 1000 + 40 * (1 - 0.240) ≈ 1030`
- `peak = 1030`

Andre kamp: spilleren (1030) taper mot SuperBot 5000 (1800).

- `E = 1 / (1 + 10^((1800 - 1030) / 400)) ≈ 0.012`
- `R_p' = 1030 + 40 * (0 - 0.012) ≈ 1030`
- `peak` forblir 1030.

## Hvor det skal implementeres

Funksjonen er ren — ingen sideeffekter, ingen lagring. Den itererer historikken sortert stigende på `playedAt` og returnerer endelig snapshot. Hjemskjermen og evt. andre forbrukere bruker en hook (f.eks. `useRating()`) som leser historikken via `useGameHistory()` og memoiserer resultatet.
