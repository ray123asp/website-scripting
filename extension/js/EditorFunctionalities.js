function EditorFunctionalities()
{
    var chromeFunctions = new ChromeFunctionalities();
    var commonFunctions = new CommonFunctionalities();
    this.configurationId;
    var _this = this;

    this.init = function()
    {
        this.inputNameTag = document.getElementById("web-script-name-input");
        this.inputURLTag = document.getElementById("page-url-show");
        this.inputEnabledTag = document.getElementById("web-script-enabled-checkbox-input");
        this.inputJqueryTag = document.getElementById("enable-jquery-checkbox-input");
        this.inputScriptDataTag = document.getElementById("script-data-text-area");
        document.getElementById("saveConfigurationButton").onclick = this.saveConfigurationButton;
        document.getElementById("libraries-open-button").onclick = this.toggleLibrariesBox;
        document.getElementById("web-script-name-input").onkeyup = this.onNameChange;
    }

    this.toggleLibrariesBox = function()
    {
        if(document.getElementById("libraries-container").style.display == "none")
        {
            document.getElementById("libraries-container").style.display = "block";
        }
        else
        {
            document.getElementById("libraries-container").style.display = "none";
        }
    }

    this.loadContainer = function(thisConfiguration)
    {
        this.configurationId = thisConfiguration.id;
        this.inputNameTag.value = thisConfiguration.name;
        this.inputURLTag.value = thisConfiguration.urlRegEx;
        this.inputEnabledTag.checked = thisConfiguration.enabled;
        this.inputJqueryTag.checked = thisConfiguration.jqueryEnabled;
        this.inputScriptDataTag.value = thisConfiguration.scriptData;
    }

    this.saveConfigurationButton = function()
    {
        var thisConfiguration = {};
        thisConfiguration.scriptData = _this.inputScriptDataTag.value;
        thisConfiguration.scriptDataID = _this.configurationId;
        thisConfiguration.configurationName = _this.inputNameTag.value;
        thisConfiguration.configurationPurpose = null;
        thisConfiguration.configurationUrlRegex = _this.inputURLTag.value;
        thisConfiguration.configurationEnabled = _this.inputEnabledTag.checked;
        thisConfiguration.jqueryEnabled = _this.inputJqueryTag.checked;

        chromeFunctions.saveThisConfiguration(thisConfiguration, function(){
            if(typeof _this.saveButtonCallback == "function")
            {
                _this.saveButtonCallback();
            }
            var content = chrome.i18n.getMessage("savedSuccessfully");
            var result = (content && content != "") ? content : "Saved successfully";
            commonFunctions.showToast(result);
        });
    }

    this.onNameChange = function()
    {
        var selectScriptOption = document.getElementById("select-option-for-different-script");
        if(selectScriptOption != null)
        {
            var options = document.getElementById("select-option-for-different-script").children;
            if(options && options.length > 0)
            {
                for(var i=0;i<options.length;i++)
                {
                    var opt = options[i];
                    if(opt.value == _this.configurationId)
                    {
                        opt.innerText = document.getElementById("web-script-name-input").value;
                    }
                }
            }
        }
    }

    this.loadNewConfiguration = function(title, regexURL, count)
    {
        if(count > 5)
        {
            console.error("Cant generate unique key");
            return;
        }
        var uniqueId = commonFunctions.generateUniqueId();
        chromeFunctions.getSingleConfiguration(uniqueId, function(thisConfiguration){
            if(thisConfiguration)
            {
                count = count + 1;
                console.error("Unique key already found");
                _this.loadNewConfiguration(title, regexURL, count);
            }
            else
            {
                let initConfiguration = {};
                initConfiguration.id = uniqueId;
                initConfiguration.name = title;
                initConfiguration.urlRegEx = regexURL;
                initConfiguration.enabled = true;
                initConfiguration.jqueryEnabled = false;
                initConfiguration.scriptData = "// Add your script here to run in this page.\n\nconsole.log(\"Testing JavaScript\");";
                _this.loadContainer(initConfiguration);
            }
        });
    }

    this.getRegexForURL = function(url)
    {
        if(url)
        {
            var urlObject = new URL(url);
            var regexUrl = urlObject.origin + "(.*)";
            return regexUrl;
        }
        else
        {
            return "";
        }
    }
}
