/* 
 *  EWOKJS - Javascript Framework for Web Applications
 *  ivanhalen@gmail.com | www.surbit.com.uy
 */

// OBTENER ELEMENTO POR SU ID
function $element(id)
{
    return document.getElementById(id);
}
// SETEA POSICION ABSOLUTA DE UN ELEMENTO
function $placeElement(elementId, x, y, positionType)
{
    var element = $element(elementId);
	if ($isset(positionType))
		positionType = "absolute";
    element.style.position = positionType;            
    element.style.left = x; // + 'px';
    element.style.top = y; // + 'px';
}
// RETORNA [ SETEA ] EL CONTENIDO DE UN ELEMENTO
function $content(element, content)
{
    if (typeof(content) != 'undefined')
        element.innerHTML = content;
    return element.innerHTML;
}
// SETEA EL CONTENIDO DE UN ARHIVO EN UN CONTENEDOR
function $setContentFromFile(element, fileName)
{
    var content = $loadTextDoc(fileName);
    // var content = $getFileContent(fileName);
    $content(element, content);
}
// OBTIENE EL CONTENIDO DE UN ARCHIVO DE TEXTO
function $getFileContent(fileName)
{
    var file = fopen(getScriptPath(fileName), 0);
    var fileLenght = flength(file);
    var content = fread(file, fileLenght);    
    return content;
}
// RETORNA [ SETEA ] EL VALUE DE UN ELEMENTO
function $value(element, value)
{
    if (typeof(value) != 'undefined')
        element.value = value;
    return element.value;
}
// SETEAR VALOR DE UNA PROPIEDAD CSS A UN ELEMENTO
function $cssSet(element, param, value)
{    
    element.style[param] = value;
}
// OBTENER VALOR DE UNA PROPIEDAD CSS DE UN ELEMENTO
function $cssGet(element, param)
{ 
    return element.style[param];
}
// SETEAR CLASE CSS A UN ELEMENTO
function $className(element, className)
{
    element.className = className;
}
function $isArray(element)
{
   if (element.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}
function $isset(param)
{
    var resultado;
    if (typeof(param) == 'undefined')
        resultado = false;
    else
        resultado = true;
    return resultado;
}
// MOSTRAR ELEMENTO
function $show(element)
{
    $cssSet(element, 'display', 'initial');
}
// OCULTAR ELEMENTO
function $hide(element)
{
    if ($isArray(element))
    {
        for (var n = 0; n < $count(element); n++)
        {
            $cssSet(element[n], 'display', 'none');
        }
    }
    else
        $cssSet(element, 'display', 'none');
}
// INCLUDE
function $include(src)
{
    document.write('<script type="text/javascript" src="' + src + '"></script'+'>');
}
// VALIDATORS
function $validateEmail(email)
{    
    var expresion = /^[a-z][\w.-]+@\w[\w.-]+\.[\w.-]*[a-z][a-z]$/i;
    if (expresion.test(email))
        return true;
    else
        return false;
}
// UTILS
// PAGE SCROLL UTILS
var $ewokUtil_autoScrolling = false;
var $ewokUtil_autoScrollStep = 1;
var $ewokUtil_autoScrollTimer = null;
var $ewokUtil_autoScrollDirection = "bottom";
function $scrollToTop()
{
    window.scrollTo(0, 0);
}
function $scrollToBottom()
{
    window.scrollTo(0, $getScrollMaxY());
}
function $startScrolling(direction, initialStep)
{
    if (!$ewokUtil_autoScrolling)
    {
        if ($isset(initialStep))
            $ewokUtil_autoScrollStep = initialStep;
        $ewokUtil_autoScrollDirection = direction;
        $ewokUtil_autoScrolling = true;
        $ewokUtil_autoScrollTimer = setInterval($doAutoScroll, 25);        
    }
    else
    {
        $ewokUtil_autoScrolling = false;
        clearInterval($ewokUtil_autoScrollTimer);
        $ewokUtil_autoScrollStep = 1;
    }
}
function $doAutoScroll()
{
    var currentScrollY = window.scrollY;
    var maxScrollY = $getScrollMaxY();
    if ($ewokUtil_autoScrollDirection == "bottom" && maxScrollY - currentScrollY < $ewokUtil_autoScrollStep)
    {
        $scrollToBottom();
        $ewokUtil_autoScrolling = false;
        clearInterval($ewokUtil_autoScrollTimer);
        $ewokUtil_autoScrollStep = 1;
    }
    else if ($ewokUtil_autoScrollDirection == "top" && currentScrollY < $ewokUtil_autoScrollStep)
    {
        $scrollToTop();
        $ewokUtil_autoScrolling = false;
        clearInterval($ewokUtil_autoScrollTimer);
        $ewokUtil_autoScrollStep = 1;
    }
    else
    {
        var tmpStep = $ewokUtil_autoScrollStep;
        if ($ewokUtil_autoScrollDirection == "top")
            tmpStep *= -1;
        window.scrollBy(0, tmpStep);
        $ewokUtil_autoScrollStep += 5;
    }
}
function $getScrollMaxY()
{
    var innerh;
    if (window.innerHeight)
        innerh = window.innerHeight;
    else
        innerh = document.body.clientHeight;
    if (window.innerHeight && window.scrollMaxY)
        // Firefox 
        yWithScroll = window.innerHeight + window.scrollMaxY; 
    else if (document.body.scrollHeight > document.body.offsetHeight)
        // all but Explorer Mac 
        yWithScroll = document.body.scrollHeight; 
    else 
        // works in Explorer 6 Strict, Mozilla (not FF) and Safari 
        yWithScroll = document.body.offsetHeight;     
    return yWithScroll - innerh; 
}
function $generateRandomId(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function $getIntToBool(intVal)
{
    if (intVal == 0)
        return false;
    else
        return true;
}
function $getBoolToInt(boolValue)
{
    if (boolValue == false)
        return 0;
    else
        return 1;
}
function $getItemById(objArray, id, idFieldName)
{
    if (!$isset(idFieldName))
        idFieldName = "id";
    var item = null;
    var it = 0;    
    var found = false;
    while (!found && it < objArray.length)    
    {
        if (objArray[it][idFieldName] === id)
        {
            item = objArray[it];
            found = true;
        }
        it++;
    }
    return item;
}
function $roundToTwo(num) 
{ 
    return Number(Math.round(num + "e+2") + "e-2");
}
// TEMPLATE FROM FILE
function $getTemplateFromFile(fileName, separator)
{    
    var content = $loadTextDoc(fileName);
    var template = {
        render: content
    };
    if ($isset(separator))
        template.separator = separator;
    return template;
}
// RENDER OBJECT
function $renderObject(object, template, container, itemIndex)
{
    if (!$isset(itemIndex))
        itemIndex = -1;
    var renderTemplate = template.render;
    var posStart = renderTemplate.indexOf("@{");
    var posEnd = 0;
    while (posStart >= 0)
    {
        posEnd = renderTemplate.indexOf("}", posEnd + 1);
        var paramName = renderTemplate.substring(posStart + 2, posEnd);
        if ($isset(object[paramName]) || paramName === "__itemIndex__")
        {
            if (paramName === "__itemIndex__")
                renderTemplate = renderTemplate.replace("@{" + paramName + "}", itemIndex);
            else
                renderTemplate = renderTemplate.replace("@{" + paramName + "}", object[paramName]);
            posEnd = 0;
        }   
        posStart = renderTemplate.indexOf("@{", posEnd + 1);
    }
    if ($isset(container) && container !== null)
        $content(container, renderTemplate);    
    else
        return renderTemplate;
}
// RENDER COLLECTION
function $renderCollection(collection, template, container)
{
    var firstElement = true;
    var renderTemplate = "";
    if (collection.length > 0)
    {
        for (var n = 0; n < collection.length; n++)
        {
           if (!firstElement)
               renderTemplate += template.separator;
           renderTemplate += $renderObject(collection[n], template, null, n);
           firstElement = false;
        }
    }
    else if ($isset(template.voidRender))
        renderTemplate = template.voidRender;
    if ($isset(container))
        $content(container, renderTemplate);    
    else
        return renderTemplate;
}
function $loadXMLDoc(filename)
{
    if (window.XMLHttpRequest)
        xhttp = new XMLHttpRequest();
    else // code for IE5 and IE6
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
}
function $loadTextDoc(filename)
{
    if (window.XMLHttpRequest)
        xhttp = new XMLHttpRequest();
    else
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseText;
}
function $showModal(modalId, componentFocusId, timeoutFocus)
{
    $('#' + modalId).modal('show');
    if ($isset(componentFocusId))
    {        
        if (!$isset(timeoutFocus))
            timeoutFocus = 500;
        setTimeout($setDelayedFocus, timeoutFocus, componentFocusId);
    }    
}
function $setDelayedFocus(componentId)
{
    $element(componentId).focus();
}
function $hideModal(modalId)
{
    $('#' + modalId).modal('hide');
}
/* 
   ****************
   ** COMPONENTS **
   **************** 
*/
var ewokComponents = [];
 
function ewokRegistrateNewComponent(ewokComponent)
{
    var index = ewokComponents.length;
    ewokComponents.push(ewokComponent);
    return index;
}

function ewokProcessAction(ewokComponentIndex, action, params)
{   
    eval("ewokComponents[" + ewokComponentIndex + "]." + action + "(" + params + ");");
}
 
// COMBO
function $Combo(idHtmlSelect)
{    
    this.htmlSelect = $element(idHtmlSelect);
    this.dataProvider = null;
    this.idField = "";
    this.nameField = "";
    this.itemFilter = null;
    this.clear = function()
    {
        this.htmlSelect.options.length = 0;
    };
    this.add = function(itemId, itemName, itemIndex)
    {
        var option = document.createElement("option");
        option.id = itemId;
        option.text = itemName;
        if ($isset(itemIndex))
            this.htmlSelect.add(option, itemIndex);
        else
            this.htmlSelect.add(option);
    };
    this.setDataProvider = function(dataProvider, idField, nameField)
    {
        this.dataProvider = dataProvider;
        this.idField = idField;
        this.nameField = nameField;
        for (var it = 0; it < dataProvider.length; it++)
        {
            var item = dataProvider[it]; 
            if (this.itemFilter == null)
                this.add(item[idField], item[nameField]);
            else
                this.add(item[idField], this.itemFilter(item));
        }
    };
    this.refresh = function()
    {
        this.clear();
        this.setDataProvider(this.dataProvider, this.idField, this.nameField);
    };
    /* GET SELECTED METHODS */
    this.getSelectedIndex = function()
    {
        return this.htmlSelect.selectedIndex;
    };
    this.getSelectedItem = function()
    {
        var item;
        if (this.dataProvider != null)
            item = this.dataProvider[this.getSelectedIndex()];
        else
            item = this.htmlSelect.options[this.getSelectedIndex()]; 
        return item;
    };
    this.getSelectedItems = function()
    {
        var selectedItems = [];
        var itOption;
        for (var it = 0; it < this.htmlSelect.options.length; it++)
        {
            itOption = this.htmlSelect.options[it];
            if (itOption.selected)
            {
                if (this.dataProvider != null)
                    selectedItems.push(this.dataProvider[it]);
                else
                    selectedItems.push(itOption);                    
            }
        }
        return selectedItems;
    };
    this.getSelectedId = function()
    {
        return this.htmlSelect.options[this.getSelectedIndex()].id;
    };
    this.getSelectedText = function()
    {
        return this.htmlSelect.options[this.getSelectedIndex()].text;
    };
    this.getItemsCount = function()
    {
        return this.htmlSelect.options.length;
    };
    /* SET SELECTED METHODS */
    this.setSelectedIndex = function(index)
    {
        this.htmlSelect.selectedIndex = index;
    };
    this.setSelectedId = function(id)
    {
        var n = 0;
        var found = false;
        while (n < this.htmlSelect.options.length && !found)
        {
            var item = this.htmlSelect.options[n];
            if (item.id == id)
            {
                this.setSelectedIndex(n);
                found = true;
            }            
            n++;
        }
    };
    this.setSelectedText = function(text)
    {
    	var n = 0;
        var found = false;
        while (n < this.htmlSelect.options.length && !found)
        {
            var item = this.htmlSelect.options[n];
            if (item.text == text)
            {
                this.setSelectedIndex(n);
                found = true;
            }            
            n++;
        }
    };
    // EVENTS
    this.setOnChange = function (onChangeCallBack)
    {
        this.htmlSelect.onchange = onChangeCallBack;
    };
    // REGISTRATE COMPONENT
    this.ewokCompoenentIndex = ewokRegistrateNewComponent(this);
}
// CHECKBOX
function $CheckBox(idHtmlElement)
{
    this.htmlElement = $element(idHtmlElement);
    this.itemData = null;
    this.setItemData = function(_itemData)
    {
        this.itemData = _itemData;
    };
    this.getItemData = function()
    {
        return this.itemData;
    };
    this.getChecked = function()
    {
        return this.htmlElement.checked;
    };
    this.setChecked = function(value)
    {
        this.htmlElement.checked = value;
    };
    // EVENTS
    this.setOnChange = function (onChangeCallBack)
    {
        this.htmlElement.onchange = onChangeCallBack;
    };
}
// GRID
function $Grid(idContainerDiv)
{
    this.container = $element(idContainerDiv);
    this.idField = "id";
    this.dataProvider = null;
    this.columnsDefs = [];
    this.onRowClick = "";
    this.selectedItem = null;
    this.voidRender = "No items found.";
    this.itemsCountTemplate = "";
    this.showTotalAsItem = false;
    this.htmlTableId = "";
    this.gridTemplate = {
        render: "<table class='table'>@{rows}</table>",
        separator: ""
    }; 
    this.rowClick = function(itemIndex)
    {
        this.selectedItem = this.dataProvider[itemIndex];
        // alert("Evento interno -> Click at item: " + JSON.stringify(this.selectedItem));
        if (this.onRowClick != "")
            this.onRowClick(this.selectedItem);
    };
    this.gridHeaderRowTemplate = {
        render: "<tr>@{columns}</tr>",
        separator: ""
    };
    this.gridRowTemplate = {
        render: "<tr style='height:15px;' onclick='ewokProcessAction(@{ewokComponentIndex}, \"rowClick\", @{rowIndex});'>@{columns}</tr>",
        separator: ""
    };
    this.gridHeaderColumnTemplate = {
        render: "<th class='@{headerCellClass}' style='@{headerCellStyle}'>@{columnName}</th>",
        separator: ""
    };
    this.gridTDColumnTemplate = {
        render: "<td class='@{cellClass}' style='@{cellStyle}'>@{itemValue}</td>",
        separator: ""
    };
    this.setDataProvider = function(dataProvider, idField)
    {
        this.dataProvider = dataProvider;
        this.idField = idField;
        this.render();
    };
    this.setHtmlTableId = function(htmlTableId)
    {
        if (htmlTableId != "")
            this.gridTemplate.render = "<table id='" + htmlTableId + "' class='table'>@{rows}</table>";
        this.htmlTableId = htmlTableId;
    };
    this.render = function()
    {
        var allRowsContent = "";
        // TH ROW CONTENT
        allRowsContent += $renderObject({columns: $renderCollection(this.columnsDefs, this.gridHeaderColumnTemplate)}, this.gridHeaderRowTemplate);
        // EACH TD ROW CONTENT
        var item;
        var itemFieldName;
        var itemValue;
        var itemRender = {};
        var tdRowContent;
        // RENDER ITEMS
        if (this.dataProvider.length > 0)
        {
            for (var it = 0; it < this.dataProvider.length; it++)
            {
                tdRowContent = "";
                item = this.dataProvider[it];                
                for (var itColumnDef = 0; itColumnDef < this.columnsDefs.length; itColumnDef++)
                {
                    itemFieldName = this.columnsDefs[itColumnDef].itemField;                
                    itemValue = item[itemFieldName];
                    if ($isset(this.columnsDefs[itColumnDef].itemFilter))
                        itemValue = this.columnsDefs[itColumnDef].itemFilter(itemValue, item, it);
                    if ($isset(this.columnsDefs[itColumnDef].cellStyleFilter))
                        this.columnsDefs[itColumnDef].cellStyle = this.columnsDefs[itColumnDef].cellStyleFilter(item);
                    itemRender = {
                        itemValue:itemValue,
                        cellClass:this.columnsDefs[itColumnDef].cellClass,
                        cellStyle:this.columnsDefs[itColumnDef].cellStyle
                    };
                    tdRowContent += $renderObject(itemRender, this.gridTDColumnTemplate);                 
                }            
                allRowsContent += $renderObject({columns: tdRowContent, rowIndex:it, ewokComponentIndex: this.ewokCompoenentIndex}, this.gridRowTemplate);
            }
            if (this.itemsCountTemplate !== "")
            {
                var itemsCount = this.dataProvider.length;
                if (this.showTotalAsItem)
                    itemsCount -= 1;
                var itemsCountContent = $renderObject({itemsCount:itemsCount}, this.itemsCountTemplate);                
                allRowsContent += "<tr><td align='center' colspan='" + this.columnsDefs.length + "'>" + itemsCountContent + "</td></tr>";
            }
        }
        // VOID RENDER
        else
        {
            allRowsContent += "<tr><td align='center' colspan='" + this.columnsDefs.length + "'>" + this.voidRender + "</td></tr>";
        }
        // RENDER GRID
        $renderObject({rows: allRowsContent}, this.gridTemplate, this.container);
    };
    // REGISTRATE COMPONENT
    this.ewokCompoenentIndex = ewokRegistrateNewComponent(this);
}
/* 
   ******************
   ** COMUNICATION **
   ****************** 
*/
var ewokCOM_onDataListener;
var ewokCOM_onErrorListener;

var ewokCOM_headerContenType = "application/x-www-form-urlencoded";
// var ewokCOM_dataType = "text";

function $request(url, data, method, pOnDataListener, pOnErrorListener, pTimeout, pOnTimeout)
{
    ewokCOM_onDataListener = pOnDataListener;
    ewokCOM_onErrorListener = pOnErrorListener;
    if (window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
        req.onreadystatechange = $ewokCOM_onRequestChange;
        req.open(method, url, true);
        req.setRequestHeader('Content-Type', ewokCOM_headerContenType);                
        if ($isset(pTimeout))
            req.timeout = pTimeout;
        if ($isset(pOnTimeout))
            req.ontimeout = pOnTimeout;
        req.send(data);
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject('Microsoft.XMLHTTP');
        if (req)
        {
            req.onreadystatechange = $ewokCOM_onRequestChange;
            req.open(method, url, true);
            req.setRequestHeader('Content-Type', ewokCOM_headerContenType);        
            if ($isset(pTimeout))
                req.timeout = pTimeout;
            if ($isset(pOnTimeout))
                req.ontimeout = pOnTimeout;
            req.send(data);
        }
    }
}
function $post(url, data, pOnDataListener, pOnErrorListener, pTimeout, pOnTimeout)
{
    ewokCOM_onDataListener = pOnDataListener;
    ewokCOM_onErrorListener = pOnErrorListener;
    if (window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
        req.onreadystatechange = $ewokCOM_onRequestChange;
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', ewokCOM_headerContenType);                
        if ($isset(pTimeout))
            req.timeout = pTimeout;
        if ($isset(pOnTimeout))
            req.ontimeout = pOnTimeout;
        req.send(data);
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject('Microsoft.XMLHTTP');
        if (req)
        {
            req.onreadystatechange = $ewokCOM_onRequestChange;
            req.open('POST', url, true);
            req.setRequestHeader('Content-Type', ewokCOM_headerContenType);        
            if ($isset(pTimeout))
                req.timeout = pTimeout;
            if ($isset(pOnTimeout))
                req.ontimeout = pOnTimeout;
            req.send(data);
        }
    }
}
function $get(url, data, pOnDataListener, pOnErrorListener, pTimeout, pOnTimeout)
{
    ewokCOM_onDataListener = pOnDataListener;
    ewokCOM_onErrorListener = pOnErrorListener;
    var urlData = url;
    if (data !== "")
        urlData += "?" + data;
    if (window.XMLHttpRequest)
    {        
        req = new XMLHttpRequest();
        req.onreadystatechange = $ewokCOM_onRequestChange;        
        req.open('GET', urlData, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        if ($isset(pTimeout))
            req.timeout = pTimeout;
        if ($isset(pOnTimeout))
            req.ontimeout = pOnTimeout;
        req.send(null);
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject('Microsoft.XMLHTTP');
        if (req)
        {
            req.onreadystatechange = $ewokCOM_onRequestChange;
            req.open('GET', urlData, true);
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if ($isset(pTimeout))
                req.timeout = pTimeout;
            if ($isset(pOnTimeout))
                req.ontimeout = pOnTimeout;
            req.send();
        }
    }
}
function $ewokCOM_onRequestChange()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
           ewokCOM_onDataListener(req.responseText);
        else
            ewokCOM_onErrorListener(req.responseText);
    }
}