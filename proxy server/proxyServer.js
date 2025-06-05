/* ---------- Genders ---------- */
function getGenderCounts() {
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

function postGenderPick(gender) {
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

function postAiPick(aiPick) {
    console.log('picked ai:', aiPick)
}

/* ---------- Politics ---------- */
export function getPoliticsCounts() {
  return {
    left: 150,
    center: 150,
    right: 200
  }
}

function postPoliticsLeft() {
    console.log('picked politics: left')
}

function postPoliticsCenter() {
    console.log('picked politics: center')
}

function postPoliticsRight() {
    console.log('picked politics: right')
}