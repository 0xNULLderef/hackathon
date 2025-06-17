import { Router } from 'express'

import * as DbServices from '@/services/db'

const router = Router()

router.get('/quests', (_, res) => {
  res.json(
    DbServices.query<
      {
        id: number
        name: string
        questImageCount: number
        questImageCompleteCount: number
      },
      []
    >(
      'SELECT q.id, q.name, COUNT(qi.id) questImageCount, COUNT(qic.id) questImageCompleteCount FROM quests q LEFT JOIN quest_images qi ON qi.quest_id = q.id LEFT JOIN user_quest_images_completed qic ON qic.quest_image_id = qi.id GROUP BY q.id'
    )
  )
})

router.get('/quest_image_next/{:questId}', (req, res) => {
  const questId = parseInt(req.params.questId!)

  res.json(
    DbServices.querySingle<
      { id: number; name: string; url: string },
      [[number]]
    >(
      'SELECT qi.id, qi.name, qi.url FROM quest_images qi LEFT JOIN user_quest_images_completed qic ON qic.quest_image_id = qi.id WHERE qi.quest_id = ? AND qic.id IS NULL',
      [questId]
    ) ?? { done: true }
  )
})

router.get('/quest_image_mark/{:questImageId}', (req, res) => {
  const questImageId = parseInt(req.params.questImageId!)

  // TODO: hardcoded userid
  const userId = 1

  DbServices.execute<[[number, number]]>(
    'INSERT INTO user_quest_images_completed (user_id, quest_image_id) VALUES (?, ?)',
    [userId, questImageId]
  )

  res.send(200)
})

export default router
