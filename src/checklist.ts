
export class ChecklistItem{
	check:()=>void
	note?:string

	constructor(onCheck:()=>void, note?:string){
		this.note = note
		this.check = onCheck
	}
}

export class Checklist{
	items = new Set<ChecklistItem>()
	numTotalItems:number = 0
	onItemCheck:(note?:string)=>void
	onComplete:()=>void

	constructor(
		{
			onItemCheck = (note?:string)=>{},
			onComplete = ()=>{}
		}:{
			onItemCheck?:(note?:string)=>void,
			onComplete?:()=>void
		} = {}
	){
		this.onItemCheck = onItemCheck
		this.onComplete = onComplete
	}

	newItem({onCheck = ()=>{}, note}:{onCheck?:()=>void, note?:string} = {}){
		this.numTotalItems++
		let checklist = this

		let thisItem = new ChecklistItem(()=>{
			onCheck()
			
			checklist.onItemCheck(thisItem.note)
			checklist.items.delete(thisItem)
			
			if(checklist.items.size == 0){
				checklist.onComplete()
			}
		}, note)

		this.items.add(thisItem)
        return thisItem
	}

	getProgress(){
		return 1.0 - this.items.size / this.numTotalItems
	}

	reset(){
		this.items.clear()
		this.numTotalItems = 0
	}
}
