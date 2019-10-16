<template>
  <div style="padding: 20px; text-align:center">
		<div id="container" v-on:mouseup="click_viewer" />
  </div>
</template>

<script>
import pdfjsLib from 'pdfjs-dist'
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer'
import './pdf_viewer.css'

export default {
  components: {},
  data () {
    return {
			url: '',
			title: '',
			pdf_canvas_id: 'pdfviewer',
			observer: null
		}
  },
	computed: {},
	mounted() {
		const params = new URLSearchParams(window.location.search)
		this.url = params.get('file')
		this.set_handler()
		this.render_pdf()
	},
  methods: {
		click_viewer() {
			const text = window.getSelection().toString()
      console.log('text', text)
      if (text == '') {
        return
      }
      this.$store.dispatch('push_selected_text', text)
		},
		set_handler() {
			// current view page
			const callback = (entries, observer) => {
				const page_id = entries[0].target.id
				console.log('entries', page_id)
			}
			const options = {
				root: null,
				rootMargin: '0px',
				threshold: [0.5]
			}
			this.observer = new IntersectionObserver(callback, options)
		},
		render_pdf() {
			const self = this
			const extension_id = chrome.runtime.id
			const workerSrc = `chrome-extension://${extension_id}/pdf.worker.bundle.js`
			pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

			pdfjsLib.getDocument(this.url)
  			.then(function(pdf) {
					// Get div#container and cache it for later use
					var container = document.getElementById("container");
					// Loop from 1 to total_number_of_pages in PDF document
					for (var i = 1; i <= pdf.numPages; i++) {
						// Get desired page
						pdf.getPage(i).then(function(page) {
							var scale = 1.5;
							var viewport = page.getViewport(scale);
							var div = document.createElement("div");
							
							self.observer.observe(div)

							// Set id attribute with page-#{pdf_page_number} format
							div.setAttribute("id", "page-" + (page.pageIndex + 1));
							// This will keep positions of child elements as per our needs
							div.setAttribute("style", "position: relative");
							// Append div within div#container
							container.appendChild(div);
							// Create a new Canvas element
							var canvas = document.createElement("canvas");
							// Append Canvas within div#page-#{pdf_page_number}
							div.appendChild(canvas);
							var context = canvas.getContext('2d');
							canvas.height = viewport.height;
							canvas.width = viewport.width;

							var renderContext = {
								canvasContext: context,
								viewport: viewport
							};

							// Render PDF page
							page.render(renderContext)
								.then(function() {
									// Get text-fragments
									return page.getTextContent();
								})
								.then(function(textContent) {
									console.log('aa', textContent)
									// Create div which will hold text-fragments
									var textLayerDiv = document.createElement("div");

									// Set it's class to textLayer which have required CSS styles
									textLayerDiv.setAttribute("class", "textLayer");

									// Append newly created div in `div#page-#{pdf_page_number}`
									div.appendChild(textLayerDiv);

									// Create new instance of TextLayerBuilder class
									var textLayer = new TextLayerBuilder({
										textLayerDiv: textLayerDiv, 
										pageIndex: page.pageIndex,
										viewport: viewport
									});

									// Set text-fragments
									textLayer.setTextContent(textContent);

									// Render text-fragments
									textLayer.render();
								});
						});
					}
			});
		}
	},
}
</script>

<style>
#pdfviewer {
	width:100%;
	height:100%;
}
</style>