import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
console.log("Going to import rake-js")
import * as rake from "rake-js";
//import rake from "./rake-js";
export default class MyPlugin extends Plugin {
	settings: AutotaggerSettings;
	onInit(){}

	async onload() {
		console.log('loading Auto tagger plugin');
	    this.settings = (await this.loadData()) || new AutotaggerSettings();

	    this.addSettingTab(new AutotaggerSettingTab(this.app, this));
		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice!');
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Create tags',
			callback: () => this.onTrigger(),
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});


		this.addSettingTab(new AutotaggerSettingTab(this.app, this));

		this.registerEvent(this.app.on('codemirror', (cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		}));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading Auto tagger plugin');
	}
/* My code  */

	getSelectedText(editor: any) {
	if (editor.somethingSelected()) {
	  return editor.getSelection();
	} else {
	  var wordBoundaries = this.getWordBoundaries(editor);
	  editor.getDoc().setSelection(wordBoundaries.start, wordBoundaries.end);
	  return editor.getSelection();
	}
	}

	getWordBoundaries(editor: any) {
	var cursor = editor.getCursor();
	var line = cursor.line;
	var word = editor.findWordAt({ line: line, ch: cursor.ch });
	var wordStart = word.anchor.ch;
	var wordEnd = word.head.ch;

	return {
	  start: { line: line, ch: wordStart },
	  end: { line: line, ch: wordEnd },
	};
	}		

	getTags(selectedText: string){
		//const tags = rake(selectedText, { language: 'english' })
		console.log(rake(selectedText, { language: 'english' }))
		console.log(tags)
		return tags
	}

	onTrigger(){
		let activeLeaf: any = this.app.workspace.activeLeaf;
	    let editor = activeLeaf.view.sourceMode.cmEditor;
	    var cursor = editor.getCursor();
	    var selectedText = this.getSelectedText(editor);
    	console.log("Inside onTrigger")
	    let tags = this.getTags(selectedText)

	}




}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText("One day you will make this work! :)");
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

/* to fill #test */
class AutotaggerSettings {

}

/* The settings tab */
class AutotaggerSettingTab extends PluginSettingTab {
	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange((value) => {
					console.log('Secret: ' + value);
				}));

	}
}
