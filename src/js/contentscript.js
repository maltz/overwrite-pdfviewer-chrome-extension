console.log('chrome-extension-boilerplate')

class content_script {
	constructor() {
		this.result = {
			url: "",
			title: "",
		}
		this.url = document.location.href
	}
	run() {
		if (document.location.href.slice(-4) == '.pdf') {
			this.remove_default_pdfviewer()
			this.append_iframe()
		}
	}
	append_iframe() {
		let frame = document.createElement('iframe')
		frame.setAttribute("id", "extension-frame")
		frame.style.border = 'none'
		frame.style.display = 'block'
		frame.style.height = '100%'
		frame.style.width = '100%'
		frame.style.position = 'fixed'
		frame.style.left = '0px'
		frame.style.top = 0

		frame.src = chrome.runtime.getURL('popup.html') + `?file=${this.url}`
    document.body.appendChild(frame)
	}
	remove_default_pdfviewer() {
		const embed_elements = document.getElementsByTagName('embed')
		const default_viewr = embed_elements[0]
		default_viewr.remove()
	}
}

const cs = new content_script()
cs.run()