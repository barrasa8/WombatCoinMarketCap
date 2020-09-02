let baseURL = "https://api.coingecko.com/api/v3";

//Local Storage
if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.setItem("currency", "usd");
    localStorage.setItem("currentPage",1);
    localStorage.setItem("perPage",50);
    localStorage.setItem("title","Top Cryptocurrencies by Marketcap Capitalization");
    localStorage.setItem("currencySymbol","$");
    localStorage.setItem("cryptoData","");
} else {
window.alert("Sorry, no local storage");
}


function formatNumber(number){
    if(number===null){
        return "--"
    }

    let decimalParts=2;

    if(number<1){
        decimalParts=5;
    }

    number = number.toFixed(decimalParts) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};
    
function RedGreenClassToggle(price_change_percentage_24h){
    if(price_change_percentage_24h > 0){
        return "green";
    }else{
        return "red";
    }
};

const printExchangeTable =  async (perPage,page) => {
    try{
        let endpoint="/exchanges?per_page="+localStorage.getItem("perPage")+"&page="+localStorage.getItem("currentPage");
        let url = baseURL + endpoint;

        let res =  await fetch(url);
        let data = await res.json();

        $('#here-table').append(
                        '<table class="table table-hover" >'
                        +'<thead>'
                        +'<tr>'
                        +'  <th scope="col">Rank</th>'
                        +'  <th scope="col">Name</th>'
                        +'  <th scope="col">Trust Score</th>'
                        +'  <th scope="col">BTC Trade Volume (24h)</th>'
                        +'  <th scope="col">Year Launched</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tbody id="here-tbody">'
                    );
    
        for(let i=0 ;i<localStorage.getItem("perPage");i++){
            
            $('#here-tbody').append( '<tr>'
                                        +'<th scope="row">' + data[i].trust_score_rank + '</th>'
                                        +'<th>' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</th>'
                                        +'<td>' + data[i].trust_score + '</td>'
                                        +'<td>' + "$"+formatNumber(data[i].trade_volume_24h_btc)+ '</td>'
                                        +'<td>' + data[i].year_established + '</td>'
                                    +'</tr>'
                                    );
        };

        $("#here-tbody").append(
            '</tbody>'
            +'</table>'
        );
    }catch(err){
        console.log(err);
    }
}

const printCryptoCurrencyTable = async (baseURL,currency,perPage,page) => {
    try{

        let endpoint = "/coins/markets?vs_currency="+localStorage.getItem("currency")+"&order=market_cap_desc&per_page="+localStorage.getItem("perPage")+"&page="+localStorage.getItem("currentPage")+"&sparkline=false&price_change_percentage=24h";
        let url = baseURL + endpoint;

        
        let res =  await fetch(url);
        let data = await res.json();

        localStorage.setItem("cryptoData",JSON.stringify(data));

        $('#here-table').append(
                    '<table class="table table-hover" >'
                    +'<thead>'
                    +'<tr>'
                    +'  <th scope="col">Rank</th>'
                    +'  <th scope="col">Name</th>'
                    +'  <th scope="col">Market Cap</th>'
                    +'  <th scope="col">Price</th>'
                    +'  <th scope="col">Volume (24h)</th>'
                    +'  <th scope="col">Circulating Supply</th>'
                    +'  <th scope="col">Change (24h)</th>'
                    +'</tr>'
                +'</thead>'
                +'<tbody id="here-tbody">'
                );

        for(let i=0 ;i<perPage;i++){
            
            $('#here-tbody').append( '<tr>'
                                        +'<th scope="row">' + data[i].market_cap_rank + '</th>'
                                        +'<th>' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</th>'
                                        +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].market_cap) + '</td>'
                                        +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].current_price)+ '</td>'
                                        +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].total_volume) + '</td>'
                                        +'<td>' + formatNumber(data[i].total_supply) + '</td>'
                                        +'<td class="'+RedGreenClassToggle(data[i].price_change_percentage_24h)+'" id="coin'+data[i].market_cap_rank +'">' + data[i].price_change_percentage_24h +' %' + '</td>'
                                    +'</tr>'
                                    );
        };

        $("#here-tbody").append(
                '</tbody>'
                +'</table>'
        );
    }catch(err){
        console.log(err);
    };
};

function ClickNextPage(currentPage){

    localStorage.setItem("currentPage", Number(localStorage.getItem("currentPage"))+1);

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));    
    }
    else{
        printExchangeTable(localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
    }

    if($("#previous-link").hasClass("invisible") && localStorage.getItem("currentPage")>1){
        $("#previous-link").removeClass("invisible");
    }

    if(localStorage.getItem("currentPage")==3){
        $("#next-link").addClass("invisible");
    }

    //Show page in title
    $("#title-page-text").html("(Page " + localStorage.getItem("currentPage") + ")");

    return localStorage.getItem("currentPage");
}

function ClickPreviousPage(currentPage){
    
    localStorage.setItem("currentPage", Number(localStorage.getItem("currentPage"))-1);

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));    
    }
    else{
        printExchangeTable(100,localStorage.getItem("currentPage"));
    }

    if($("#next-link").hasClass("invisible") && localStorage.getItem("currentPage")<5){
        $("#next-link").removeClass("invisible");
    }

    if(localStorage.getItem("currentPage")==1){
        $("#previous-link").addClass("invisible");
    }

    //Show Page in title
    if(localStorage.getItem("currentPage")==1){
        $("#title-page-text").html("");
    }else{
        $("#title-page-text").html("(Page " + localStorage.getItem("currentPage") + ")");
    }

    return localStorage.getItem("currentPage");
}

function cleanTable(){
    $("#here-table").html("");
}

function orderCryptoTable(orderField,isAsc){
    
    var data = JSON.parse(localStorage.getItem('cryptoData'));

    switch (orderField) {
        case "current_price":
            if(isAsc==true){
                return data.sort((a, b) => parseFloat(b.current_price) - parseFloat(a.current_price));    
            }else if(isAsc==false){
                return data.sort((a, b) => parseFloat(a.current_price) - parseFloat(b.current_price));
            }
            break;
        case "market_cap":
            if(isAsc==true){
                return data.sort((a, b) => parseFloat(a.market_cap) - parseFloat(b.market_cap));
            }else{ if(isAsc==false)
                return data.sort((a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap));   
            }
            break;
        case "total_volume":
            if(isAsc==true){
                return data.sort((a, b) => parseFloat(a.total_volume) - parseFloat(b.total_volume));
            }else if(isAsc==false){
                return data.sort((a, b) => parseFloat(b.total_volume) - parseFloat(a.total_volume));  
            }
            break;
        case "price_change_percentage_24h":
            if(isAsc==true){
                return data.sort((a, b) => parseFloat(a.price_change_percentage_24h) - parseFloat(b.price_change_percentage_24h));                
            }else if(isAsc==false){
                return data.sort((a, b) => parseFloat(b.price_change_percentage_24h) - parseFloat(a.price_change_percentage_24h));    
            }
            break;
        default:
          console.log("Sorry, Not a valide field to sort.");
      }
}

document.addEventListener("DOMContentLoaded", () => {
    //insert PerPage number in title
    $("#perPageText").html(localStorage.getItem("perPage"));

    printCryptoCurrencyTable(baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

    $("#next-link").click(function(){
        $("#here-table").html("");
        localStorage.setItem("currentPage",ClickNextPage(localStorage.getItem("currentPage")));
    });

    $("#previous-link").click(function(){
        $("#here-table").html("");
        localStorage.setItem("currentPage",ClickPreviousPage(localStorage.getItem("currentPage")));
    });
    
    $("#exchange-tab").click(function(){
        if(!$("#exchange-tab").hasClass("active")){
            $("#crypto-tab").removeClass("active");
            $("#exchange-tab").addClass("active");
            cleanTable();
            printExchangeTable(localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#crypto-tab").click(function(){
        if(!$("#crypto-tab").hasClass("active")){
            $("#exchange-tab").removeClass("active");
            $("#crypto-tab").addClass("active");
            cleanTable();
            printCryptoCurrencyTable(baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#currencyGroupSelect").click(function(){
        localStorage.setItem("currency",$("#currencyGroupSelect option:selected").val());
        if(localStorage.getItem("currency")=="eur"){
            localStorage.setItem("currencySymbol","€");        
        }else{
            localStorage.setItem("currencySymbol","$");        
        }
        cleanTable();
        if($("#crypto-tab").hasClass("active")){
            console.log("crypto tab is active")
            printCryptoCurrencyTable(baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }else{
            printExchangeTable(localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#perPageGroupSelect").click(function(){
        localStorage.setItem("perPage",$("#perPageGroupSelect option:selected").val());
        $("#perPageText").html(localStorage.getItem("perPage"));
        cleanTable();
        if($("#crypto-tab").hasClass("active")){
            console.log("crypto tab is active")
            printCryptoCurrencyTable(baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }else{
            printExchangeTable(localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });    

});
