const CONFIG_FILENAME   = "config.json";
const PRONOUNS          = ['they/them','he/him','she/her','pronouns (any)','pronouns (ask)'];
const GENDERS           = ['cis', 'egg', 'enby', 'transmasc', 'transfemme', 'genderfluid', 'agender'];
const SEXUALITIES       = ['straight', 'lesbian', 'gay', 'bi', 'pan', 'queer', 'ace', 'demi'];
const ID_ROLES = PRONOUNS.concat(GENDERS).concat(SEXUALITIES);

module.exports = {
    CONFIG_FILENAME,
    PRONOUNS,
    GENDERS,
    SEXUALITIES,
    ID_ROLES
}