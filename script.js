
let itemsOnPage = 20;
let total = 20;
let current = 0;
let length;
let sortCounter = 0;
let lastSortField = 'id';
let tableObject = {};
let tableSorted = {};
let newArray = [];
let lastChild;

document.body.onload = function() {
	let request = new XMLHttpRequest();
	request.onload = function (){
		tableObject = JSON.parse(request.responseText);
		tableSorted = tableObject.slice();
		length = tableSorted.length;
		showPage(current, tableSorted, length);
	};
	request.open('GET', 'db.json');
	request.send();
};

let ths = document.getElementsByTagName('th');

for (th of ths) {
	th.onclick = function(){
		let field = this.id.split('-')[1];
		if(field !== lastSortField) {
			document.getElementById('item-' + lastSortField).lastChild.setAttribute('class', 'none');
			sortCounter = 0;
		}
		sortCounter++;
		lastSortField = field;
		tableSorted = tableObject.slice();
		tableSorted.sort(function(a, b){
			if((typeof a) === 'string') {
				var x = a[field].toLowerCase();
				var y = b[field].toLowerCase();
			} else {
				if(field === 'price') {
					var x = parseFloat(a[field]);
					var y = parseFloat(b[field]);
				} else {
					var x = a[field];
					var y = b[field];
				}				
			}
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;
		});
		switch(sortCounter % 3) {
		case 1:
			this.lastChild.setAttribute('class', 'fas fa-long-arrow-alt-up');
			lastChild = this.lastChild;
			lastChild.classList.add('ml-1');
		break;
		case 2:
			this.lastChild.setAttribute('class', 'fas fa-long-arrow-alt-down');
			lastChild = this.lastChild;
			lastChild.classList.add('ml-1');
			tableSorted.reverse();
		break;
		default:
			this.lastChild.setAttribute('class', 'none');
			tableSorted = tableObject.slice();		
		}
		length = tableSorted.length;
		showPage(current, tableSorted, length);
	};
}

function textPrint() {
	let regexp = document.getElementById('textarea').value;
	let newRegexp = regexp.toLowerCase();
	let found = [];
	for(let message of tableObject){
		let newTitle = message.title.toLowerCase();
			if(newTitle.match(newRegexp)){
				found.push(message);
			}
	}
	length = found.length;
	newArray = found;
	showPage(current, found, length);
}

document.getElementById('selectBox').onchange = function (){
	let selectBox = document.getElementById('selectBox');
	total = parseInt(selectBox.options[selectBox.selectedIndex].value, 10);
	if (!isNaN(total)){
		itemsOnPage = total;
	} else {
		itemsOnPage = length;
	}
	document.getElementById('item-' + lastSortField).lastChild.setAttribute('class', 'none');
	showPage(current, tableObject, length);
};

function changePage(){
	let actives = document.getElementsByClassName('active');
	for (active of actives) {
		active.classList.remove('active');
	}
	if(length < tableSorted.length){
		showPage(this.lastChild.innerHTML - 1, newArray, length);
	}
	else{
		showPage(this.lastChild.innerHTML - 1, tableSorted, length);
	}
	
};

function showPage(current, table, length){
	if(!length) length = table.length;
	let mas;
	let firstItem = current * itemsOnPage;
	let lastItem = firstItem + itemsOnPage;
	if (total != 'All'){ 
		mas = table.slice(firstItem, lastItem); 
	}
	else { 
		mas = table;
	}
	let tbody = document.getElementById('tbody');
	let newBody = document.createElement('tbody');
	newBody.id = 'tbody';
	document.getElementById('table').replaceChild(newBody, tbody);
	for(let message of mas){
		let tr = document.createElement('tr');
		let td1 = document.createElement('td');
		let td2 = document.createElement('td');
		let td3 = document.createElement('td');
		let td4 = document.createElement('td');
		let td5 = document.createElement('td');
		newBody.appendChild(tr);
		tr.classList.add('tr');
		td1.innerHTML = message.id;
		td2.innerHTML = message.title;
		td3.innerHTML = message.price;
		td4.innerHTML = message.color;
		td5.innerHTML = message.department;
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
	}
	if(isNaN(itemsOnPage)) itemsOnPage = length;
	let pages = Math.ceil(length/itemsOnPage);
	let start = 1;
	
	let pagination = document.getElementById('pagination');
	let newPagination = document.createElement('ul');
	newPagination.classList.add('pagination', 'justify-content-center');
	newPagination.id = 'pagination';
	let paginationContainer = document.getElementById('pagination-container');
	paginationContainer.replaceChild(newPagination, pagination);
	
	while (start <= pages) {
		let li = document.createElement('li');
		let a = document.createElement('a');
		li.classList.add('page-item');
		li.id = start - 1;
		a.classList.add('page-link');
		a.innerHTML = start;
		li.onclick = changePage;
		newPagination.appendChild(li);
		li.appendChild(a);
		start++;
	}
	document.getElementById(current).classList.add('active');
};