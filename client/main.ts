// Client entry point

import { loadFromDB, page, posts, storeMine, displayLoading } from './state'
import { start as connect, connSM, connState } from './connection'
import { open } from './db'
import { initOptions } from "./options"
import initPosts from "./posts"
import { Post, postSM, postEvent, FormModel } from "./posts"
import { ThreadData } from "./common"
import {
	renderBoard, extractConfigs, setThreadTitle, renderThread
} from './page'
import { default as initUI, setTitle } from "./ui"
import { checkBottom, getCookie, deleteCookie, trigger } from "./util"
import assignHandlers from "./client"
import initModeration from "./mod"

// Load all stateful modules in dependency order
async function start() {
	const frag = document.getElementById("threads")
	extractConfigs()

	await open()
	if (page.thread) {
		await loadFromDB(page.thread)

		// Add a stored thread OP, made by the client to "mine"
		const addMine = getCookie("addMine")
		if (addMine) {
			const id = parseInt(addMine)
			storeMine(id, id)
			deleteCookie("addMine")
		}
	}

	initOptions()

	if (page.thread) {
		renderThread()

		// Open a cross-thread quoting reply
		connSM.once(connState.synced, () => {
			const data = localStorage.getItem("openQuote")
			if (!data) {
				return
			}
			const i = data.indexOf(":"),
				id = parseInt(data.slice(0, i)),
				sel = data.slice(i + 1)
			localStorage.removeItem("openQuote")
			if (posts.get(id)) {
				postSM.feed(postEvent.open);
				(trigger("getPostModel") as FormModel).addReference(id, sel)
			}
		})

		connect()
		checkBottom()
		assignHandlers()
		setThreadTitle(posts.get(page.thread) as Post & ThreadData)
	} else {
		await renderBoard()
		setTitle(frag.querySelector("#page-title").textContent)
		displayLoading(false)
	}

	initPosts()
	initUI()
	initModeration()
}

start().catch(err => {
	alert(err.message)
	throw err
})
