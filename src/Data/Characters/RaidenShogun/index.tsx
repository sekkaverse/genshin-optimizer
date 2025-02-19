import card from './Character_Raiden_Shogun_Card.png'
import thumb from './Icon.png'
import thumbSide from './IconSide.png'
import banner from './Banner.png'
import c1 from './constellation1.png'
import c2 from './constellation2.png'
import c3 from './constellation3.png'
import c4 from './constellation4.png'
import c5 from './constellation5.png'
import c6 from './constellation6.png'
import skill from './skill.png'
import burst from './burst.png'
import passive1 from './passive1.png'
import passive2 from './passive2.png'
import passive3 from './passive3.png'
import Stat from '../../../Stat'
import formula, { data, energyCosts, getResolve, resolveStacks } from './data'
import data_gen from './data_gen.json'
import { getTalentStatKey, getTalentStatKeyVariant } from '../../../Build/Build'
import { ICharacterSheet } from '../../../Types/character'
import { Translate } from '../../../Components/Translate'
import { chargedDocSection, conditionalHeader, normalSrc, plungeDocSection, sgt, talentTemplate } from '../SheetUtil'
import { WeaponTypeKey } from '../../../Types/consts'
import { basicDMGFormulaText } from '../../../Util/FormulaTextUtil'
import { FormulaPathBase } from '../../formula'
import { KeyPath } from '../../../Util/KeyPathUtil'
const path = KeyPath<FormulaPathBase, any>().character.RaidenShogun
const tr = (strKey: string) => <Translate ns="char_RaidenShogun_gen" key18={strKey} />
const charTr = (strKey: string) => <Translate ns="char_RaidenShogun" key18={strKey} />

function burstDMGFormulaText(percent, stats, intial = false) {
  const resolveStack = getResolve(stats)

  const resolve = (intial ? data.burst.resolve[stats.tlvl.burst] : data.burst.resolve_[stats.tlvl.burst])
  let ratioText = <span>{percent}%</span>
  if (resolveStack)
    ratioText = <span>( {percent}% + {resolve}% * {resolveStack} ) * </span>
  if (stats.constellation < 2)
    return <span>{ratioText} {Stat.printStat(getTalentStatKey("burst", stats), stats)} </span>

  const hitModeMultiKey = stats.hitMode === "avgHit" ? "burst_avgHit_base_multi" : stats.hitMode === "critHit" ? "critHit_base_multi" : ""
  return <span>{ratioText} {Stat.printStat("finalATK", stats)} * {(hitModeMultiKey ? <span>{Stat.printStat(hitModeMultiKey, stats)} * </span> : null)}{Stat.printStat("electro_burst_hit_base_multi", stats)} * {enemyLevelMultiC2(stats)} * {Stat.printStat("electro_enemyRes_multi", stats)}</span>
}

function skillDMGFormulaText(percent, stats) {
  if (stats.constellation < 2)
    return basicDMGFormulaText(percent, stats, "skill")

  const hitModeMultiKey = stats.hitMode === "avgHit" ? "skill_avgHit_base_multi" : stats.hitMode === "critHit" ? "critHit_base_multi" : ""
  return <span>{percent}% {Stat.printStat("finalATK", stats)} * {(hitModeMultiKey ? <span>{Stat.printStat(hitModeMultiKey, stats)} * </span> : null)}{Stat.printStat("electro_skill_hit_base_multi", stats)} * {enemyLevelMultiC2(stats)} * {Stat.printStat("electro_enemyRes_multi", stats)}</span>
}
function enemyLevelMultiC2(stats) {
  return <span>( ( 100 + {Stat.printStat("characterLevel", stats)} ) / ( 100 + {Stat.printStat("characterLevel", stats)} + ( 100 + {Stat.printStat("enemyLevel", stats)} ) * Max( ( 100% - {Stat.printStat("enemyDEFRed_", stats)} ) * ( 100% - 60% ) , 10% ) ) )</span>
}
const char: ICharacterSheet = {
  name: tr("name"),
  cardImg: card,
  thumbImg: thumb,
  thumbImgSide: thumbSide,
  bannerImg: banner,
  rarity: data_gen.star,
  elementKey: "electro",
  weaponTypeKey: data_gen.weaponTypeKey as WeaponTypeKey,
  gender: "F",
  constellationName: tr("constellationName"),
  title: tr("title"),
  baseStat: data_gen.base,
  baseStatCurve: data_gen.curves,
  ascensions: data_gen.ascensions,
  talent: {
    formula,
    sheets: {
      auto: {
        name: tr("auto.name"),
        img: normalSrc(data_gen.weaponTypeKey as WeaponTypeKey),
        sections: [
          {
            text: tr("auto.fields.normal"),
            fields: data.normal.hitArr.map((percentArr, i) =>
            ({
              text: <span>{sgt(`normal.hit${i + 1}`)} {i === 2 ? <span>(<Translate ns="sheet" key18="hits" values={{ count: 2 }} />)</span> : ""}</span>,
              formulaText: stats => <span>{percentArr[stats.tlvl.auto]}% {Stat.printStat(getTalentStatKey("normal", stats), stats)}</span>,
              formula: formula.normal[i],
              variant: stats => getTalentStatKeyVariant("normal", stats),
            }))
          },
          chargedDocSection(tr, formula, data, data.charged.stam),
          plungeDocSection(tr, formula, data)
        ],
      },
      skill: {
        name: tr("skill.name"),
        img: skill,
        sections: [{
          text: tr("skill.description"),
          fields: [{
            text: tr("skill.skillParams.0"),
            formulaText: stats => skillDMGFormulaText(data.skill.skillDMG[stats.tlvl.skill], stats),
            formula: formula.skill.skillDMG,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            text: tr("skill.skillParams.1"),
            formulaText: stats => skillDMGFormulaText(data.skill.coorDMG[stats.tlvl.skill], stats),
            formula: formula.skill.coorDMG,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            text: tr("skill.skillParams.2"),
            value: data.skill.duration
          }, {
            text: tr("skill.skillParams.4"),
            value: data.skill.cd
          }],
          conditional: {
            key: "e",
            name: charTr("skill.eye"),
            stats: {
              modifiers: { burst_dmg_: [path.skill.eleBurConv()] },
            },
            fields: [{
              text: tr("skill.skillParams.3"),
              formulaText: stats => <span>{data.skill.eleBurConv[stats.tlvl.skill] * 100}% * {data.burst.enerCost}</span>,
              formula: formula.skill.eleBurConv,
              fixed: 1,
              unit: "%"
            },]
          },
        }, {
          conditional: {
            key: "ep",
            partyBuff: "partyOnly",
            header: conditionalHeader("skill", tr, skill),
            description: tr("skill.description"),
            name: charTr("skill.partyCost"),
            states: Object.fromEntries(energyCosts.map(c => [c, {
              name: `${c}`,
              fields: [{
                text: tr("skill.skillParams.3"),
                formulaText: stats => <span>{data.skill.eleBurConv[stats.tlvl.skill] * 100}% * {c}</span>,
                formula: formula.skill[c],
                fixed: 1,
                unit: "%"
              }],
              stats: {
                modifiers: { burst_dmg_: [[...path.skill(), `${c}`]] },
              },
            }]))
          },
        }]
      },
      burst: {
        name: tr("burst.name"),
        img: burst,
        sections: [{
          text: tr("burst.description"),
          fields: [{
            text: tr("burst.skillParams.0"),
            formulaText: stats => burstDMGFormulaText(data.burst.dmg[stats.tlvl.burst], stats, true),
            formula: formula.burst.dmg,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.3"),
            formulaText: stats => burstDMGFormulaText(data.burst.hit1[stats.tlvl.burst], stats),
            formula: formula.burst.hit1,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.4"),
            formulaText: stats => burstDMGFormulaText(data.burst.hit2[stats.tlvl.burst], stats),
            formula: formula.burst.hit2,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.5"),
            formulaText: stats => burstDMGFormulaText(data.burst.hit3[stats.tlvl.burst], stats),
            formula: formula.burst.hit3,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.6"),
            formulaText: stats => burstDMGFormulaText(data.burst.hit41[stats.tlvl.burst], stats),
            formula: formula.burst.hit41,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.6"),
            formulaText: stats => burstDMGFormulaText(data.burst.hit42[stats.tlvl.burst], stats),
            formula: formula.burst.hit42,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.7"),
            formulaText: stats => burstDMGFormulaText(data.burst.hit5[stats.tlvl.burst], stats),
            formula: formula.burst.hit5,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.8"),
            formulaText: stats => burstDMGFormulaText(data.burst.charged1[stats.tlvl.burst], stats),
            formula: formula.burst.charged1,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.8"),
            formulaText: stats => burstDMGFormulaText(data.burst.charged2[stats.tlvl.burst], stats),
            formula: formula.burst.charged2,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.9"),
            value: data.burst.stam,
          }, {
            text: tr("burst.skillParams.10"),
            formulaText: stats => burstDMGFormulaText(data.burst.plunge[stats.tlvl.burst], stats),
            formula: formula.burst.plunge,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.11"),
            formulaText: stats => burstDMGFormulaText(data.burst.plungeLow[stats.tlvl.burst], stats),
            formula: formula.burst.plungeLow,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: tr("burst.skillParams.11"),
            formulaText: stats => burstDMGFormulaText(data.burst.plungeHigh[stats.tlvl.burst], stats),
            formula: formula.burst.plungeHigh,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          },
          {
            text: tr("burst.skillParams.12"),
            value: stats => data.burst.enerGen[stats.tlvl.burst],
            fixed: 1
          }, {
            text: tr("burst.skillParams.13"),
            value: data.burst.duration,
            unit: "s"
          }, {
            text: tr("burst.skillParams.14"),
            value: data.burst.cd,
            unit: "s"
          }, {
            text: tr("burst.skillParams.15"),
            value: data.burst.enerCost,
          }],
          conditional: {
            key: "q",
            name: charTr("burst.resolves"),
            states: Object.fromEntries(resolveStacks.map(c => [c, {
              name: `${c}`,
            }]))
          }
        }],
      },
      passive1: talentTemplate("passive1", tr, passive1),
      passive2: {
        name: tr("passive2.name"),
        img: passive2,
        sections: [{
          text: tr("passive2.description"),
          fields: [{
            canShow: stats => stats.ascension >= 4,
            text: charTr("a4.enerRest"),
            value: stats => {
              return (stats.enerRech_ - 100) * 0.6
            },
            unit: "%"
          }, {
            text: charTr("a4.eleDMG"),
            formulaText: stats => <span>( {Stat.printStat("enerRech_", stats)} - 100% ) * 0.4</span>,
            formula: formula.a4.eleDMG,
            fixed: 1,
            unit: "%"
          }],
          conditional: {
            key: "a4",
            canShow: stats => stats.ascension >= 4,
            maxStack: 0,
            stats: {
              modifiers: { electro_dmg_: [path.a4.eleDMG()] },
            }
          }
        }],
      },
      passive3: talentTemplate("passive3", tr, passive3),
      constellation1: talentTemplate("constellation1", tr, c1),
      constellation2: talentTemplate("constellation2", tr, c2),
      constellation3: talentTemplate("constellation3", tr, c3, "burstBoost"),
      constellation4: {
        name: tr("constellation4.name"),
        img: c4,
        sections: [{
          text: tr("constellation4.description"),
          conditional: {
            key: "c4",
            canShow: stats => stats.constellation >= 4,
            partyBuff: "partyOnly",
            header: conditionalHeader("constellation4", tr, c4),
            description: tr("constellation4.description"),
            name: charTr("c4.expires"),
            stats: { atk_: 30 }
          }
        }],
      },
      constellation5: talentTemplate("constellation5", tr, c5, "skillBoost"),
      constellation6: talentTemplate("constellation6", tr, c6),
    },
  },
};
export default char;
