import selenium

from selenium import webdriver  # Imp
driver = webdriver.Chrome(executable_path ="chromedriver.exe")
url="file:///F:/MyApp/Q-DOCT/options.html"
driver.get(url)
UTILS=open("utils.js").read()
ATOMS=open("atoms.js").read()
KAR=open("kar.js").read()
JQUERY=open("jquery-3.2.1.min.js").read()
SELENIUM_BROWSER_BOT=open("selenium-browserbot.js").read()
SELENIUM_API=open("selenium-api.js").read()
SELENIUM_COMMAND=open("selenium-commandhandlers.js").read()
USER_EXTENSION=open("user_extension.js").read()
BOWSER=open("bowser.js").read()
DOM_COLLECTOR=open("dom_collector.js").read()
KU_RECORDER=open("ku-recorder.js").read()
KU_LOCATOR_BUILDER=open("ku-locatorBuilders.js").read()
NEIGHBOUR_GEN=open("neighbor-xpaths-generator.js").read()
NEIGHBOUR_MIN=open("neighbor-xpaths-generator.min.js").read()
JS=open("last_main.js").read()
JS2=JQUERY+NEIGHBOUR_MIN+NEIGHBOUR_GEN+UTILS+SELENIUM_COMMAND+SELENIUM_BROWSER_BOT+ATOMS+KU_LOCATOR_BUILDER+JS
driver.execute_script(JS2)
