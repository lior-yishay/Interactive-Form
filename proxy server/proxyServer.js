/* ---------- Genders ---------- */
export function getGenderCounts() {
  return [
        { name: "male", count: 140 },
        { name: "female", count: 140 },
        { name: "Non-binary", count: 45 },
        { name: "Transgender", count: 25 },
        { name: "Genderqueer", count: 10 },
        { name: "Cisgender", count: 20 },
        { name: "Trans man", count: 12 },
        { name: "Trans woman", count: 12 },
        { name: "Agender", count: 8 },
        { name: "Genderfluid", count: 8 },
        { name: "Bigender", count: 6 },
        { name: "Intersex", count: 6 },
        { name: "Androgynous", count: 6 },
        { name: "Demiboy", count: 5 },
        { name: "Demigirl", count: 5 },
        { name: "Genderflux", count: 4 },
        { name: "Gender questioning", count: 4 },
        { name: "Cis man", count: 4 },
        { name: "FTM", count: 4 },
        { name: "MTF", count: 4 },
        { name: "Polygender", count: 3 },
        { name: "Pangender", count: 3 },
        { name: "Two-Spirit", count: 3 },
        { name: "Gender nonconforming", count: 3 },
        { name: "Transfeminine", count: 3 },
        { name: "Transmasculine", count: 3 },
        { name: "Androgyne", count: 2 },
        { name: "Neutrois", count: 2 },
        { name: "Abinary", count: 2 },
        { name: "Aporagender", count: 2 },
        { name: "Autigender", count: 1 },
        { name: "Maverique", count: 1 },
        { name: "Trigender", count: 1 },
        { name: "Hijra", count: 1 },
        { name: "Butch", count: 1 },
        { name: "Femme", count: 1 },
        { name: "Agenderflux", count: 1 },
        { name: "Bakla", count: 1 },
        { name: "Bissu", count: 1 },
        { name: "Calabai", count: 1 },
        { name: "Calalai", count: 1 },
        { name: "Demiflux", count: 1 },
        { name: "Genderblank", count: 1 },
        { name: "Genderfree", count: 1 },
        { name: "Gender gifted", count: 1 },
        { name: "Gender variant", count: 1 },
        { name: "Graygender", count: 1 },
        { name: "Intergender", count: 1 },
        { name: "Ipsogender", count: 1 },
        { name: "Kathoey", count: 1 },
        { name: "Māhū", count: 1 },
        { name: "Meta-gender", count: 1 },
        { name: "Muxe", count: 1 },
        { name: "Omnigender", count: 1 },
        { name: "Sekhet", count: 1 },
        { name: "Third gender", count: 1 },
        { name: "Transsexual", count: 1 },
        { name: "Travesti", count: 1 },
        { name: "Tumtum", count: 1 },
        { name: "Vakasalewalewa", count: 1 },
        { name: "Waria", count: 1 },
        { name: "X-gender", count: 1 },
        { name: "X-jendā", count: 1 },
        { name: "Xenogender", count: 1 }
    ]
}

export function postGenderPick(gender) {
  console.log('picked gender:', gender)
}

/* ---------- Casata ---------- */
function getIceCreamSandwichCounts() {
  return {
    vanila: 255, 
    chocolate: 245
  }
}

function postIceCreamSandwichVanila() {
  console.log('picked flavor: vanila')
}

function postIceCreamSandwichChocolate() {
  console.log('picked flavor: chocolate')
}

/* ---------- AI ---------- */
function getAiCounts() {
    return {
        enemy: 200,
        friend: 300
    }
}

function postAiFriend() {
    console.log('picked ai: friend')
}

function postAiEnemy() {
    console.log('picked ai: enemy')
}

/* ---------- Politics ---------- */
export function getPoliticsCounts() {
  return {
    left: 250,
    center: 250,
    right: 250
  }
}

export function postPoliticsLeft() {
    console.log('picked politics: left')
}

export function postPoliticsCenter() {
    console.log('picked politics: center')
}

export function postPoliticsRight() {
    console.log('picked politics: right')
}

/* ---------- Living Here ---------- */
function getLivingHereCounts() {
  return {
    iWillNot: 100,
    education: 200,
    mentalHealth: 300,
    betterFuture: 400,
    job: 500
  }
}

function postLivingHere_iWillNot() {
  return console.log("picked living here: i will not")
}

function postLivingHere_education() {
  return console.log("picked living here: education")
}

function postLivingHere_mentalHealth() {
  return console.log("picked living here: mental health")
}

function postLivingHere_betterFuture() {
  return console.log("picked living here: better future")
}

function postLivingHere_job() {
  return console.log("picked living here: job")
}

/* ---------- Unreal (captcha) ---------- */
function getUnrealCounts() {
  return {
    vaccines: 100, 
    illuminati: 200,
    aliens: 300,
    flatEarth: 400,
    nesZiona: 500,
    moonLanding: 600
  }
}

/* ******************
      IMPORTANT!!!
   ******************
pass a list that consist of only those values:
    vaccines, 
    illuminati,
    aliens,
    flat earth,
    nes ziona,
    moon landing,
example: postUnrealPicks(["vaccines", "aliens", "moon landing"]) */
function postUnrealPicks(picks) {
   const UNREAL_OPTIONS = [
    "vaccines", 
    "illuminati",
    "aliens",
    "flat earth",
    "nes ziona",
    "moon landing",
  ]

  if(!Array.isArray(picks)){
    console.log('the argument that was passed to postUnrealPicks func was not a list')
    return
  }

  const invalidPicks = picks.filter(pick => !UNREAL_OPTIONS.includes(pick))
  if(invalidPicks.length > 0){
    console.log("the following picks are not valid:", invalidPicks)
    return
  }

  console.log('unreal picks:', picks)
}


