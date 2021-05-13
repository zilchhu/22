import { Http, Response, useRequestInfo } from 'farrow-http'

import { mt_shops } from '../21/mt_poi.js'
import { mt_cats_by_shop, mt_cat_by_id_w } from '../21/mt_cat.js'
import { mt_spus } from '../21/mt_spu.js'
import { mt_spareas } from '../21/mt_sparea.js'
import { mt_acts_by_type, mt_acts_disable_n_w, mt_acts_create_100_w, mt_acts_create_103_w } from '../21/mt_act.js'
import { elm_bad_rates, elm_order_by_rateId } from '../21/elm_rates.js'

const http = Http()

http.get('/mt/shops').use(async () => {
  try {
    let info = useRequestInfo()
    return Response.json(await mt_shops(info.query))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.get('/mt/cats/<wmpoiid:int>').use(async request => {
  try {
    return Response.json(await mt_cats_by_shop(request.params.wmpoiid))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.post('/mt/cat/<wmpoiid:int>/<tagid:int>').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(await mt_cat_by_id_w(request.params.wmpoiid, request.params.tagid, info.body))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.get('/mt/spus/<wmpoiid:int>').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(await mt_spus(request.params.wmpoiid, info.query))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.get('/mt/spareas/<wmpoiid:int>').use(async request => {
  try {
    return Response.json(await mt_spareas(request.params.wmpoiid))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.get('/mt/acts/<wmpoiid:int>/<type:int>').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(await mt_acts_by_type(request.params.wmpoiid, request.params.type, info.query))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.delete('/mt/act/<wmpoiid:int>/<type:int>/<activityId:int>').use(async request => {
  try {
    return Response.json(
      await mt_acts_disable_n_w(request.params.wmpoiid, request.params.type, request.params.activityId)
    )
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.post('/mt/acts/100/<wmpoiid:int>/<activeName:string>').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(
      await mt_acts_create_100_w(
        request.params.wmpoiid,
        request.params.activeName,
        info.body.limitPrice,
        info.body.couponPrice,
        info.body.fullPrice,
        info.body.extras
      )
    )
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.post('/mt/acts/103/<wmpoiid:int>').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(await mt_acts_create_103_w(request.params.wmpoiid, info.body.couponInfo, info.body.extras))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.get('/elm/order/<shopid:int>/<rateid:int>').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(await elm_order_by_rateId(request.params.shopid, request.params.rateid, info.query.ksid))
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.get('/elm/rates/bad').use(async request => {
  try {
    let info = useRequestInfo()
    return Response.json(
      await elm_bad_rates(info.query.startTime, info.query.endTime, info.query.shopid, info.query.ksid, info.query.rateType)
    )
  } catch (e) {
    return Response.json(e.message ?? e)
  }
})

http.listen(3000)
