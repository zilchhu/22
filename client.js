import axios from 'axios'
import sleep from 'sleep-promise'
import { mt_shops } from '../21/mt_poi.js'
import { mt_spareas } from '../21/mt_sparea.js'
import { mt_acts_by_type, mt_acts_disable_n_w, mt_acts_create_100_w, mt_acts_create_103_w } from '../21/mt_act.js'

try {
  for (let shop of await mt_shops()) {
    console.log(shop.id)
    try {
      if (await is0Express(shop.id)) {
        let acts98 = await mt_acts_by_type(shop.id, 98, { status: 1 })
        if (acts98.length > 0) {
          console.log('disable 98', await mt_acts_disable_n_w(shop.id, 98, acts98[0].activityId))
        }
        let acts100 = await mt_acts_by_type(shop.id, 100, { status: 1 })
        if (acts100.length > 0) {
          console.log('disable 100', await mt_acts_disable_n_w(shop.id, 100, acts100[0].activityId))
          await sleep(2000)
          console.log(
            'create 100',
            await mt_acts_create_100_w(shop.id, '下单返券', 39, 2, 39)
          )
        } else {
          console.log('create 100', await mt_acts_create_100_w(shop.id, '下单返券', 39, 2, 39))
        }
        let acts103 = await mt_acts_by_type(shop.id, 103, { status: 1 })
        if (acts103.length > 0) {
          console.log(
            'disable 103',
            await Promise.all(acts103.map(a => mt_acts_disable_n_w(shop.id, 103, a.activityId)))
          )
          await sleep(2000)
          console.log(
            'create 103',
            await mt_acts_create_103_w(shop.id, [
              {
                limitPrice: 39,
                price: 2,
                stock: 3000,
                valityDays: '7',
                customType: 2,
                limitCount: 0,
                limitDayCount: 0
              }
            ])
          )
        } else {
          console.log(
            'create 103',
            await mt_acts_create_103_w(shop.id, [
              {
                limitPrice: 39,
                price: 2,
                stock: 3000,
                valityDays: '7',
                customType: 2,
                limitCount: 0,
                limitDayCount: 0
              }
            ])
          )
        }
        await sleep(3000)
      }
    } catch (e) {
      console.error(e)
      await sleep(3000)
    }
  }
} catch (error) {
  console.error(error)
}

async function is0Express(wmpoiid) {
  try {
    let { logisticsPlanDetails } = await mt_spareas(wmpoiid)
    return (
      logisticsPlanDetails[0]?.periods
        .find(v => v.isValid == 1)
        .spAreas[0]?.wmPoiSpAreaInstructions.find(k => k.businessKey == 'minPrice').fieldValue == '0'
    )
  } catch (e) {
    return Promise.reject(e)
  }
}

// 贡茶•手抓饼•小吃（武汉旗舰店）
// 苏姐牛奶甜品世家(新塘店