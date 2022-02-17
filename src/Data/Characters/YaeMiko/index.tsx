import card from './Character_Yae_Miko_Card.png'
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
import formula, { data } from './data'
import data_gen from './data_gen.json'
import { getTalentStatKey, getTalentStatKeyVariant } from '../../../Build/Build'
import { ICharacterSheet } from '../../../Types/character'
import { Translate } from '../../../Components/Translate'
import { chargedDocSection, normalDocSection, normalSrc, plungeDocSection, talentTemplate } from '../SheetUtil'
import { WeaponTypeKey } from '../../../Types/consts'
const tr = (strKey: string) => <Translate ns="char_YaeMiko_gen" key18={strKey} />
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
          normalDocSection(tr, formula, data),
          chargedDocSection(tr, formula, data, 50),
          plungeDocSection(tr, formula, data)
        ],
      },
      skill: {
        name: tr("skill.name"),
        img: skill,
        sections: [{
          text: tr("skill.description"),
          fields: [{
            canShow: stats => stats.ascension < 4,
            text: "Level 1",
            formulaText: stats => <span>{data.skill.lvl1[stats.tlvl.skill]}% {Stat.printStat(getTalentStatKey("skill", stats), stats)}</span>,
            formula: formula.skill.lvl1,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension < 4,
            text: "Level 2",
            formulaText: stats => <span>{data.skill.lvl2[stats.tlvl.skill]}% {Stat.printStat(getTalentStatKey("skill", stats), stats)}</span>,
            formula: formula.skill.lvl2,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension < 4,
            text: "Level 3",
            formulaText: stats => <span>{data.skill.lvl3[stats.tlvl.skill]}% {Stat.printStat(getTalentStatKey("skill", stats), stats)}</span>,
            formula: formula.skill.lvl3,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension < 4,
            text: "Level 4",
            formulaText: stats => <span>{data.skill.lvl4[stats.tlvl.skill]}% {Stat.printStat(getTalentStatKey("skill", stats), stats)}</span>,
            formula: formula.skill.lvl4,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension >= 4,
            text: "Level 1",
            formulaText: stats => <span>{data.skill.lvl1[stats.tlvl.skill]}% * {Stat.printStat("finalATK", stats)} * ({Stat.printStat(getTalentStatKey("skill", stats) + "_base_multi", stats)} + 0.15% * {Stat.printStat("eleMas", stats)}) * {Stat.printStat("enemyLevel_multi", stats)} * {Stat.printStat("electro_enemyRes_multi", stats)}</span>,
            formula: formula.skill.lvl1EM,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension >= 4,
            text: "Level 2",
            formulaText: stats => <span>{data.skill.lvl2[stats.tlvl.skill]}% * {Stat.printStat("finalATK", stats)} * ({Stat.printStat(getTalentStatKey("skill", stats) + "_base_multi", stats)} + 0.15% * {Stat.printStat("eleMas", stats)}) * {Stat.printStat("enemyLevel_multi", stats)} * {Stat.printStat("electro_enemyRes_multi", stats)}</span>,
            formula: formula.skill.lvl2EM,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension >= 4,
            text: "Level 3",
            formulaText: stats => <span>{data.skill.lvl3[stats.tlvl.skill]}% * {Stat.printStat("finalATK", stats)} * ({Stat.printStat(getTalentStatKey("skill", stats) + "_base_multi", stats)} + 0.15% * {Stat.printStat("eleMas", stats)}) * {Stat.printStat("enemyLevel_multi", stats)} * {Stat.printStat("electro_enemyRes_multi", stats)}</span>,
            formula: formula.skill.lvl3EM,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            canShow: stats => stats.ascension >= 4,
            text: "Level 4",
            formulaText: stats => <span>{data.skill.lvl4[stats.tlvl.skill]}% * {Stat.printStat("finalATK", stats)} * ({Stat.printStat(getTalentStatKey("skill", stats) + "_base_multi", stats)} + 0.15% * {Stat.printStat("eleMas", stats)}) * {Stat.printStat("enemyLevel_multi", stats)} * {Stat.printStat("electro_enemyRes_multi", stats)}</span>,
            formula: formula.skill.lvl4EM,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            text: "Duration",
            value: "14s",
          }, {
            text: "CD",
            value: "4s",
          }]
        }],
      },
      burst: {
        name: tr("burst.name"),
        img: burst,
        sections: [{
          text: tr("burst.description"),
          fields: [{
            text: "Skill DMG",
            formulaText: stats => <span>{data.burst.dmg[stats.tlvl.burst]}% {Stat.printStat(getTalentStatKey("burst", stats), stats)}</span>,
            formula: formula.burst.dmg,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: "Tenko Thunderbolt DMG",
            formulaText: stats => <span>{data.burst.thunderbolt[stats.tlvl.burst]}% {Stat.printStat(getTalentStatKey("burst", stats), stats)}</span>,
            formula: formula.burst.thunderbolt,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          },{
            text: "CD",
            value: "22s",
          }, {
            text: "Energy Cost",
            value: 90,
          }],
        }],
      },
      passive1: talentTemplate("passive1", tr, passive1),
      passive2: talentTemplate("passive2", tr, passive2),
      passive3: talentTemplate("passive3", tr, passive3),
      constellation1: talentTemplate("constellation1", tr, c1),
      constellation2: talentTemplate("constellation2", tr, c2),
      constellation3: talentTemplate("constellation3", tr, c3, "burstBoost"),
      constellation4: talentTemplate("constellation4", tr, c4),
      constellation5: talentTemplate("constellation5", tr, c5, "skillBoost"),
      constellation6: talentTemplate("constellation6", tr, c6),
    },
  },
};
export default char;
