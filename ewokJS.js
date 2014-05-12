/* 
 *  EWOKJS - Javascript Framework for Web Applications
 *  ivanhalen@gmail.com | www.surbit.com.uy
 */

// OBTENER ELEMENTO POR SU ID
function $element(id)
{
    return document.getElementById(id);
}
// RETORNA [ SETEA ] EL CONTENIDO DE UN ELEMENTO
function $content(element, content)
{
    if (typeof(content) != 'undefined')
        element.innerHTML = content;
    return element.innerHTML;
}
// RETORNA [ SETEA ] EL VALUE DE UN ELEMENTO
function $value(element, value)
{
    if (typeof(value) != 'undefined')
        element.value = value;
    return element.value;
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
// INCLUDE
function $include(src)
{
    document.write('<script type="text/javascript" src="' + src + '"></script'+'>');
}
// RENDER OBJECT
function $renderObject(object, template, container)
{    
    var renderTemplate = template.render;
    var posStart = renderTemplate.indexOf("@{");
    var posEnd = 0;
    while (posStart >= 0)
    {
        posEnd = renderTemplate.indexOf("}", posEnd + 1);
        var paramName = renderTemplate.substring(posStart + 2, posEnd);
        if ($isset(object[paramName]))
        {
            renderTemplate = renderTemplate.replace("@{" + paramName + "}", object[paramName]);
            posEnd = 0;
        }   
        posStart = renderTemplate.indexOf("@{", posEnd + 1);
    }
    if ($isset(container))
        $content(container, renderTemplate);    
    else
        return renderTemplate;
}
// RENDER COLLECTION
function $renderCollection(collection, template, container)
{
    var firstElement = true;
    var renderTemplate = "";
    for (var n = 0; n < collection.length; n++)
    {
       if (!firstElement)
           renderTemplate += template.separator;
       renderTemplate += $renderObject(collection[n], template);
       firstElement = false;
    }
    if ($isset(container))
        $content(container, renderTemplate);    
    else
        return renderTemplate;
}
// ** COMPONENTS **
// COMBO
function $Combo(idHtmlSelect)
{    
    this.htmlSelect = $element(idHtmlSelect);
    this.dataProvider = null;
    this.clear = function()
    {
        this.htmlSelect.options.length = 0;
    };
    this.add = function(itemId, itemName)
    {
        var option = document.createElement("option");
        option.id = itemId;
        option.text = itemName;
        this.htmlSelect.add(option, null);
    };
    this.setDataProvider = function(dataProvider, idField, nameField)
    {
        this.dataProvider = dataProvider;
        for (var it = 0; it < dataProvider.length; it++)
        {
            var item = dataProvider[it]; 
            this.add(item[idField], item[nameField]);
        }
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
    this.getSelectedId = function()
    {
        return this.htmlSelect.options[this.getSelectedIndex()].id;
    };
    this.getSelectedText = function()
    {
        return this.htmlSelect.options[this.getSelectedIndex()].text;
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
    // EVENTS
    this.setOnChange = function (onChangeCallBack)
    {
        this.htmlSelect.onchange = onChangeCallBack;
    };
}
// GRID
function $Grid(idContainerDiv)
{
    this.container = $element(idContainerDiv);
    this.idField = "id";
    this.dataProvider = null;
    this.columnsDefs = [];    
    this.gridTemplate = {
        render: "<table>@{rows}</table>",
        separator: ""
    };    
    this.gridRowTemplate = {
        render: "<tr>@{columns}</tr>",
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
    this.render = function()
    {
        var allRowsContent = "";
        // TH ROW CONTENT
        allRowsContent += $renderObject({columns: $renderCollection(this.columnsDefs, this.gridHeaderColumnTemplate)}, this.gridRowTemplate);
        // EACH TD ROW CONTENT
        var item;
        var itemFieldName;
        var itemValue;
        var itemRender = {};
        var tdRowContent;                    
        for (var it = 0; it < this.dataProvider.length; it++)
        {
            tdRowContent = "";
            item = this.dataProvider[it];                
            for (var itColumnDef = 0; itColumnDef < this.columnsDefs.length; itColumnDef++)
            {
                itemFieldName = this.columnsDefs[itColumnDef].itemField;                
                itemValue = item[itemFieldName];
                itemRender = {
                    itemValue:itemValue,
                    cellClass:this.columnsDefs[itColumnDef].cellClass,
                    cellStyle:this.columnsDefs[itColumnDef].cellStyle
                };
                tdRowContent += $renderObject(itemRender, this.gridTDColumnTemplate);                 
            }
            allRowsContent += $renderObject({columns: tdRowContent}, this.gridRowTemplate);
        }
        // RENDER GRID
        $renderObject({rows: allRowsContent}, this.gridTemplate, this.container);
    };
}