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

const fetchCryptoCurrencyData = async (baseURL,currency,perPage,page) => {
    try{

        let endpoint = "/coins/markets?vs_currency="+currency+"&order=market_cap_desc&per_page="+perPage+"&page="+page+"&sparkline=false&price_change_percentage=24h";
        let url = baseURL + endpoint;

        
        let res =  await fetch(url);
        let data = await res.json();

        localStorage.setItem("cryptoData",JSON.stringify(data));
        
        return data;

    }catch(err){
        console.log(err);
    }
}

const fetchExchangeData = async (baseURL,perPage,page) =>{
    try{
        let endpoint="/exchanges?per_page="+perPage+"&page="+page;
        let url = baseURL + endpoint;

        let res =  await fetch(url);
        let data = await res.json();

        localStorage.setItem("cryptoData",JSON.stringify(data));

        return data;

    }catch(err){
        console.log(err);
    }
}
function onClickPrintTableTypeOrderBy (tableType,elementID){
    $("#"+elementID).click(function(){  
        cleanTableBody();  
        if($("#"+elementID).hasClass("isAsc")){
            $("#"+elementID).removeClass("isAsc");
            orderCryptoTable(elementID,true); 
            if(tableType == "exchange"){
                printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
            }
            if(tableType == "crypto"){
                printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
            }
            
        }else{
            $("#"+elementID).addClass("isAsc");
            orderCryptoTable(elementID,false);
            if(tableType == "exchange"){
                printExchangeTable(false,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
            }
            if(tableType == "crypto"){
                printCryptoCurrencyTable(false,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
            }
    
        }
    });
}
const printExchangeTable =  async (doFetch,baseURL,perPage,page) => {
    try{
        let data;
        
        if(doFetch){
            data = await fetchExchangeData(baseURL,perPage,page);
            cleanTable();
            $('#here-table').append(
                '<table class="table table-hover" >'
                +'<thead>'
                +'<tr>'
                +'  <th scope="col">Rank</th>'
                +'  <th scope="col">Name</th>'
                +'  <th scope="col"><span class="table-header-order" id="trust_score" class="isAsc">Trust Score</span></th>'
                +'  <th scope="col"><span class="table-header-order" id="trade_volume_24h_btc" class="isAsc">BTC Trade Volume (24h)</span></th>'
                +'  <th scope="col"><span class="table-header-order" id="year_established" class="isAsc">Year Launched</span></th>'
                +'</tr>'
            +'</thead>'
            +'<tbody id="here-tbody">'
            );

            onClickPrintTableTypeOrderBy("exchange","trust_score");          
            onClickPrintTableTypeOrderBy("exchange","trade_volume_24h_btc");
            onClickPrintTableTypeOrderBy("exchange","year_established");
        }else{
            data = JSON.parse(localStorage.getItem("cryptoData"));
        };
        for(let i=0 ;i<perPage;i++){
            
            $('#here-tbody').append( '<tr>'
                                        +'<th scope="row">' + data[i].trust_score_rank + '</th>'
                                        +'<th><a href="'+data[i].url+'" class="exchange-name-link">' +'<img src="'+data[i].image+'" id="table-coin-logo" > ' + data[i].name + '</a></th>'
                                        +'<td>' + data[i].trust_score + '</td>'
                                        +'<td>' + localStorage.getItem("currencySymbol") +formatNumber(data[i].trade_volume_24h_btc)+ '</td>'
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
const printCryptoCurrencyTable = async (doFetch,baseURL,currency,perPage,page)=> {
        try{
            let data;

            if(doFetch){
                data = await fetchCryptoCurrencyData(baseURL,currency,perPage,page);
                cleanTable();
                $('#here-table').append(
                    '<table class="table table-hover" >'
                    +'<thead>'
                    +'<tr>'
                    +'  <th scope="col">Rank</th>'
                    +'  <th scope="col">Name</th>'
                    +'  <th scope="col"><span class="table-header-order" id="market_cap" class="isAsc">Market Cap</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="current_price" class="isAsc">Price</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="total_volume" class="isAsc">Volume (24h)</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="total_supply" class="isAsc">Circulating Supply</span></th>'
                    +'  <th scope="col"><span class="table-header-order" id="price_change_percentage_24h" class="isAsc">Change (24h)</span></th>'
                    +'</tr>'
                +'</thead>'
                +'<tbody id="here-tbody">'
                );

                onClickPrintTableTypeOrderBy("crypto","market_cap");
                onClickPrintTableTypeOrderBy("crypto","current_price");
                onClickPrintTableTypeOrderBy("crypto","total_volume");
                onClickPrintTableTypeOrderBy("crypto","price_change_percentage_24h");
                onClickPrintTableTypeOrderBy("crypto","total_supply");
            }else{
                data = JSON.parse(localStorage.getItem("cryptoData"));
            };

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
    }            
}

function ClickNextPage(currentPage){

    localStorage.setItem("currentPage", Number(localStorage.getItem("currentPage"))+1);

    if($("#crypto-tab").hasClass("active")){
        printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));    
    }
    else{
        printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
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
        printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));    
    }
    else{
        printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
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

function cleanTableBody(){
    $("#here-tbody").html("");
}

function cleanTable(){
    $("#here-table").html("");
}


function orderCryptoTable(orderField,isAsc){
    
    let data = JSON.parse(localStorage.getItem('cryptoData'));
    let dataOrdered;

    if (orderField) {
      if(isAsc==true){
          dataOrdered = data.sort((a, b) => parseFloat(b[orderField]) - parseFloat(a[orderField]));
      }else if(isAsc==false){
          dataOrdered =  data.sort((a, b) => parseFloat(a[orderField]) - parseFloat(b[orderField]));
      }
    };

    localStorage.setItem("cryptoData",JSON.stringify(dataOrdered));
}

document.addEventListener("DOMContentLoaded", () => {
    //insert PerPage number in title
    $(".perPageText").html(localStorage.getItem("perPage"));

    printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));

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
            $("#currencyGroupSelect").addClass("invisible");
            cleanTableBody();
            cleanTable();
            localStorage.setItem("currentPage",1);
            $("#previous-link").addClass("invisible");
            $("#title-page-text").html("");
            printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#crypto-tab").click(function(){
        if(!$("#crypto-tab").hasClass("active")){
            $("#exchange-tab").removeClass("active");
            $("#crypto-tab").addClass("active");
            $("#currencyGroupSelect").removeClass("invisible");
            cleanTableBody();
            localStorage.setItem("currentPage",1);
            $("#previous-link").addClass("invisible");
            $("#title-page-text").html("");
            printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#currencyGroupSelect").click(function(){
        localStorage.setItem("currency",$("#currencyGroupSelect option:selected").val());
        if(localStorage.getItem("currency")=="eur"){
            localStorage.setItem("currencySymbol","€");        
        }else{
            localStorage.setItem("currencySymbol","$");        
        }
        cleanTableBody();
        if($("#crypto-tab").hasClass("active")){
            printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }else{
            printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });

    $("#perPageGroupSelect").click(function(){
        localStorage.setItem("perPage",$("#perPageGroupSelect option:selected").val());
        $(".perPageText").html(localStorage.getItem("perPage"));
        cleanTableBody();
        if($("#crypto-tab").hasClass("active")){
            printCryptoCurrencyTable(true,baseURL,localStorage.getItem("currency"),localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }else{
            printExchangeTable(true,baseURL,localStorage.getItem("perPage"),localStorage.getItem("currentPage"));
        }
    });  


});
