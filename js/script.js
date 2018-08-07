/*jshint unused:false*/
/*jshint strict:false*/
/*globals await*/
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js').then(function(response) {
		console.log('ServiceWorker Registered Successfully');
	}).catch(function(err) {
		console.log('ServiceWorker Registration Failed : ' + err);
	});
}
var key="?client_id=cc7650affc2c4eb7d0ba&client_secret=e7522e7df292edb33a1824c1e693c9949cde372f";
function loadData(mainUrl){
	fetchAsync(mainUrl).then(function(data) {
		var mainCard=`<div class="card mainCard">
				<div class="logo">
					<a href="${data.html_url}" target="_blank"><img src="${data.avatar_url}" /></a>
				</div>
				<div class="data">
					<p><span class="hedding">Name : </span><span class="big">${data.name}</span></p>
					<p><span class="hedding">Location : </span><span class="normal">${data.location}</span></p>
					<p><span class="hedding">Company : </span><span class="normal">${data.company}</span></p>
				</div>
			</div>
			<h1>Followers</h1>`;
		document.getElementById("Container").innerHTML=mainCard;
		return (fetchAsync(data.followers_url+key));
	}).then(function(data1) {
		data1.forEach(function(item, index){
			fetchAsync(item.url+key).then(function(data) {
				if(data.name!=null){
					var Card=`<div class="card subCard" url="${data.url}">
						<div class="logo">
							<a href="${data.html_url}" target="_blank"><img src="${data.avatar_url}" /></a>
						</div>
						<div class="data">
							<p><span class="hedding">Name : </span><span class="big">${data.name}</span></p>
							<p><span class="hedding">Location : </span><span class="normal">${data.location}</span></p>
							<p><span class="hedding">Company : </span><span class="normal">${data.company}</span></p>
						</div>
					</div>`;
					document.getElementById("Container").innerHTML+=Card;
				}
			}).catch(function(reason) {
				console.log(reason.message);
			});
		});
	}).catch(function(reason) {
		console.log(reason.message);
	});
}
loadData("https://api.github.com/users/zeeshanhanif"+key);

$(document).ready(function(e) {
	$(document).on("click", ".subCard", function(){
		loadData($(this).attr("url")+key);
	});
});

async function fetchAsync (url) {
  var response = await fetch(url);
  var data = await response.json();
  return data;
}
