const json = (res, data, statusCode = 200) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => {
      if (!raw) return resolve(null)
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve(null)
      }
    })
  })

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (date = new Date()) => {
  const yyyy = date.getFullYear()
  const mm = pad2(date.getMonth() + 1)
  const dd = pad2(date.getDate())
  const hh = pad2(date.getHours())
  const mi = pad2(date.getMinutes())
  const ss = pad2(date.getSeconds())
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

const paginate = (list, pageNum, pageSize) => {
  const p = Math.max(1, Number(pageNum || 1))
  const s = Math.max(1, Number(pageSize || 10))
  const start = (p - 1) * s
  return list.slice(start, start + s)
}

const svgCaptchaDataUri = (code = '1234') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="38">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="Arial, sans-serif" font-size="18" fill="#333333" letter-spacing="3">
    ${code}
  </text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const tinyPngDataUri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/avdB4QAAAAASUVORK5CYII='

const createDb = () => {
  const now = formatDateTime()
  const roles = [
    {
      id: 1,
      roleName: '管理员',
      roleKey: 'admin',
      sortOrder: 1,
      status: 1,
      remark: '系统内置角色',
      createTime: now,
    },
    {
      id: 2,
      roleName: '运营',
      roleKey: 'operator',
      sortOrder: 2,
      status: 1,
      remark: '',
      createTime: now,
    },
    {
      id: 3,
      roleName: '访客',
      roleKey: 'guest',
      sortOrder: 3,
      status: 1,
      remark: '',
      createTime: now,
    },
  ]

  const users = [
    {
      id: 1,
      username: 'admin',
      nickname: 'Admin',
      phone: '13800000000',
      email: 'admin@example.com',
      gender: 1,
      avatar: tinyPngDataUri,
      status: 1,
      createTime: now,
      updateTime: now,
      createBy: 1,
      updateBy: 1,
    },
    {
      id: 2,
      username: 'demo',
      nickname: 'Demo',
      phone: '13900000000',
      email: 'demo@example.com',
      gender: 0,
      avatar: tinyPngDataUri,
      status: 1,
      createTime: now,
      updateTime: now,
      createBy: 1,
      updateBy: 1,
    },
  ]

  let userRoleId = 100
  let userId = 10

  const userRoles = [
    { id: userRoleId++, userId: 1, roleId: 1, status: 1, createTime: now },
    { id: userRoleId++, userId: 2, roleId: 3, status: 1, createTime: now },
  ]

  const getUserRoleIds = (uid) =>
    userRoles
      .filter((r) => r.userId === uid && r.status === 1)
      .map((r) => r.roleId)

  const setUserRoles = (uid, roleIds = []) => {
    const uniq = Array.from(
      new Set((roleIds || []).map((n) => Number(n)).filter(Boolean)),
    )
    for (const r of userRoles) {
      if (r.userId === uid) r.status = 0
    }
    for (const rid of uniq) {
      userRoles.push({
        id: userRoleId++,
        userId: uid,
        roleId: rid,
        status: 1,
        createTime: formatDateTime(),
      })
    }
  }

  const addUser = (payload) => {
    const u = {
      id: userId++,
      username: payload?.username || `user${userId}`,
      nickname: payload?.nickname || '',
      phone: payload?.phone || '',
      email: payload?.email || '',
      gender: payload?.gender ?? null,
      avatar: payload?.avatar || tinyPngDataUri,
      status: payload?.status ?? 1,
      createTime: formatDateTime(),
      updateTime: formatDateTime(),
      createBy: 1,
      updateBy: 1,
    }
    users.unshift(u)
    return u
  }

  const updateUser = (payload) => {
    const idx = users.findIndex((u) => u.id === Number(payload?.id))
    if (idx === -1) return null
    users[idx] = { ...users[idx], ...payload, updateTime: formatDateTime() }
    return users[idx]
  }

  const buildUserRecord = (u) => {
    const roleIds = getUserRoleIds(u.id)
    const roleList = roles.filter((r) => roleIds.includes(r.id))
    return { ...u, roleList }
  }

  return {
    roles,
    users,
    userRoles,
    getUserRoleIds,
    setUserRoles,
    addUser,
    updateUser,
    buildUserRecord,
  }
}

export const mockApiPlugin = ({ enabled, base = '/dev-api' } = {}) => {
  return {
    name: 'local-mock-api',
    configureServer(server) {
      if (!enabled) return

      const db = createDb()

      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next()
        if (req.method === 'OPTIONS') return json(res, null, 204)

        const url = new URL(req.url, 'http://localhost')
        const path = url.pathname

        if (!path.startsWith(base)) return next()
        const apiPath = path.slice(base.length) || '/'

        // --- Auth ---
        if (req.method === 'GET' && apiPath === '/user/generateValidateCode') {
          const code = String(Math.floor(1000 + Math.random() * 9000))
          return json(res, {
            code: 200,
            data: {
              codeKey: `mock-${Date.now()}`,
              codeValue: svgCaptchaDataUri(code),
            },
            msg: 'success',
          })
        }

        if (req.method === 'POST' && apiPath === '/user/login') {
          return json(res, {
            code: 200,
            data: { token: `mock-token-${Date.now()}` },
            msg: 'success',
          })
        }

        if (req.method === 'POST' && apiPath === '/user/logout') {
          return json(res, { code: 200, data: null, msg: 'success' })
        }

        if (req.method === 'GET' && apiPath === '/user/info') {
          const u = db.users[0]
          return json(res, {
            code: 200,
            data: {
              id: u.id,
              username: u.username,
              nickname: u.nickname,
              email: u.email,
              phone: u.phone,
              gender: u.gender,
              avatar: u.avatar,
            },
            msg: 'success',
          })
        }

        // --- Upload ---
        if (req.method === 'POST' && apiPath === '/common/upload') {
          return json(res, { code: 200, data: tinyPngDataUri, msg: 'success' })
        }

        // --- Role ---
        if (req.method === 'GET' && apiPath === '/role/list') {
          const roleName = url.searchParams.get('roleName') || ''
          const status = url.searchParams.get('status')
          const pageNum = url.searchParams.get('pageNum')
          const pageSize = url.searchParams.get('pageSize')

          let list = db.roles
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
          if (roleName) list = list.filter((r) => r.roleName.includes(roleName))
          if (status !== null && status !== '') {
            list = list.filter((r) => String(r.status) === String(status))
          }

          return json(res, {
            code: 200,
            data: {
              records: paginate(list, pageNum, pageSize),
              total: list.length,
            },
            msg: 'success',
          })
        }

        // --- User ---
        if (req.method === 'GET' && apiPath === '/user/list') {
          const username = url.searchParams.get('username') || ''
          const nickname = url.searchParams.get('nickname') || ''
          const pageNum = url.searchParams.get('pageNum')
          const pageSize = url.searchParams.get('pageSize')

          let list = db.users.slice()
          if (username) list = list.filter((u) => u.username.includes(username))
          if (nickname) {
            list = list.filter((u) => (u.nickname || '').includes(nickname))
          }
          const records = paginate(list, pageNum, pageSize).map(db.buildUserRecord)

          return json(res, {
            code: 200,
            data: { records, total: list.length },
            msg: 'success',
          })
        }

        if (req.method === 'POST' && apiPath === '/user') {
          const body = await readBody(req)
          const u = db.addUser(body)
          return json(res, { code: 200, data: u, msg: 'success' })
        }

        if (req.method === 'PUT' && apiPath === '/user') {
          const body = await readBody(req)
          const u = db.updateUser(body)
          if (!u) {
            return json(
              res,
              { code: 404, data: null, msg: 'user not found' },
              404,
            )
          }
          return json(res, { code: 200, data: u, msg: 'success' })
        }

        // --- User Role Assign ---
        if (req.method === 'GET' && apiPath === '/user/roleIds') {
          const userId = Number(url.searchParams.get('userId'))
          if (!userId) {
            return json(
              res,
              { code: 400, data: null, msg: 'userId required' },
              400,
            )
          }
          return json(res, {
            code: 200,
            data: { userId, roleIds: db.getUserRoleIds(userId) },
            msg: 'success',
          })
        }

        if (req.method === 'POST' && apiPath === '/user/assignRoles') {
          const body = await readBody(req)
          const userId = Number(body?.userId)
          const roleIds = Array.isArray(body?.roleIds) ? body.roleIds : []
          if (!userId) {
            return json(
              res,
              { code: 400, data: null, msg: 'userId required' },
              400,
            )
          }
          db.setUserRoles(userId, roleIds)
          return json(res, { code: 200, data: null, msg: 'success' })
        }

        return next()
      })
    },
  }
}

