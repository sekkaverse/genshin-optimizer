import { getTalentStatKey } from "../../../Build/Build"
import { FormulaItem, IFormulaSheet } from "../../../Types/character"
import { BasicStats } from "../../../Types/stats"
import { basicDMGFormula } from "../../../Util/FormulaUtil"

export const data = {
  normal: {
    hitArr: [
      [39.66, 42.63, 45.61, 49.57, 52.55, 55.52, 59.49, 63.45, 67.42, 71.39, 75.35, 79.32, 84.27, 89.23, 94.19],
      [38.52, 41.41, 44.3, 48.15, 51.04, 53.93, 57.78, 61.63, 65.48, 69.33, 73.19, 77.04, 81.85, 86.67, 91.48],
      [56.89, 61.16, 65.42, 71.11, 75.38, 79.64, 85.33, 91.02, 96.71, 102.4, 108.09, 113.78, 120.89, 128, 135.11],
    ],
  },
  charged: {
    dmg: [142.89, 153.61, 164.33, 178.62, 189.34, 200.05, 214.34, 228.63, 242.92, 257.21, 271.5, 285.79, 303.65, 321.51, 339.38],
  },
  plunging: {
    dmg: [56.83, 61.45, 66.08, 72.69, 77.31, 82.6, 89.87, 97.14, 104.41, 112.34, 120.27, 128.2, 136.12, 144.05, 151.98],
    low: [113.63, 122.88, 132.13, 145.35, 154.59, 165.17, 179.7, 194.23, 208.77, 224.62, 240.48, 256.34, 272.19, 288.05, 303.9],
    high: [141.93, 153.49, 165.04, 181.54, 193.1, 206.3, 224.45, 242.61, 260.76, 280.57, 300.37, 320.18, 339.98, 359.79, 379.59],
  },
  skill: {
    lvl1: [60.67, 65.22, 69.77, 75.84, 80.39, 84.94, 91.01, 97.08, 103.14, 109.21, 115.28, 121.34, 128.93, 136.51, 144.1],
    lvl2: [75.84, 81.53, 87.22, 94.8, 100.49, 106.18, 113.76, 121.34, 128.93, 136.51, 144.1, 151.68, 161.16, 170.64, 180.12],
    lvl3: [94.8, 101.91, 109.02, 118.5, 125.61, 132.72, 142.2, 151.68, 161.16, 170.64, 180.12, 189.6, 201.45, 213.3, 225.15],
    lvl4: [118.5, 127.39, 136.28, 148.13, 157.01, 165.9, 177.75, 189.6, 201.45, 213.3, 225.15, 237, 251.81, 266.63, 281.44],

  },
  burst: {
    dmg: [260, 279.5, 299, 325, 344.5, 364, 390, 416, 442, 468, 494, 520, 552.5, 585, 617.5],
    thunderbolt: [333.82, 358.85, 383.89, 417.27, 442.31, 467.34, 500.72, 534.11, 567.49, 600.87, 634.25, 667.63, 709.36, 751.09, 792.81],
  }
}
function emDMGFormula(percent: number, stats: BasicStats, skillKey: string): FormulaItem {
  const val = percent / 100
  const emMulti = 0.15 / 100
  const statKey = "electro_skill_hit_base_multi"
  // const statKey = getTalentStatKey("skill", stats) + "_base_multi"
  const critKey = "critHit_base_multi";
  const avgHitKey = "skill_avgHit_base_multi";
  const levelKey = "enemyLevel_multi";
  const resKey = "electro_enemyRes_multi";
  // return [s => val * s.finalATK * (s[statKey] + (emMulti * s.eleMas) * s[levelKey] * s[resKey]), ["finalATK", statKey, "eleMas", levelKey, resKey]]
  if (stats.hitMode === "critHit") {
    return [s => val * s.finalATK * (s[statKey] + emMulti * s["eleMas"]) * s[levelKey] * s[resKey] * s[critKey], ["finalATK", statKey, "eleMas", levelKey, resKey, critKey]]
  } else if (stats.hitMode === "avgHit") {
    return [s => val * s.finalATK * (s[statKey] + emMulti * s["eleMas"]) * s[levelKey] * s[resKey] * s[avgHitKey], ["finalATK", statKey, "eleMas", levelKey, resKey, avgHitKey]]
  } else {
    return [s => val * s.finalATK * (s[statKey] + emMulti * s["eleMas"]) * s[levelKey] * s[resKey], ["finalATK", statKey, "eleMas", levelKey, resKey]]
  }
}
const formula: IFormulaSheet = {
  normal: Object.fromEntries(data.normal.hitArr.map((arr, i) =>
    [i, stats => basicDMGFormula(arr[stats.tlvl.auto], stats, "normal")])),
  charged: Object.fromEntries(Object.entries(data.charged).map(([name, arr]) =>
    [name, stats => basicDMGFormula(arr[stats.tlvl.auto], stats, "charged")])),
  plunging: Object.fromEntries(Object.entries(data.plunging).map(([name, arr]) =>
    [name, stats => basicDMGFormula(arr[stats.tlvl.auto], stats, "plunging")])),
  skill: {
    lvl1: stats => basicDMGFormula(data.skill.lvl1[stats.tlvl.skill], stats, "skill"),
    lvl2: stats => basicDMGFormula(data.skill.lvl2[stats.tlvl.skill], stats, "skill"),
    lvl3: stats => basicDMGFormula(data.skill.lvl3[stats.tlvl.skill], stats, "skill"),
    lvl4: stats => basicDMGFormula(data.skill.lvl4[stats.tlvl.skill], stats, "skill"),

    lvl1EM: stats => emDMGFormula(data.skill.lvl1[stats.tlvl.skill], stats, "skill"),
    lvl2EM: stats => emDMGFormula(data.skill.lvl2[stats.tlvl.skill], stats, "skill"),
    lvl3EM: stats => emDMGFormula(data.skill.lvl3[stats.tlvl.skill], stats, "skill"),
    lvl4EM: stats => emDMGFormula(data.skill.lvl4[stats.tlvl.skill], stats, "skill"),

  },
  burst: Object.fromEntries(Object.entries(data.burst).map(([name, arr]) =>
    [name, stats => basicDMGFormula(arr[stats.tlvl.burst], stats, "burst")])),
}
export default formula