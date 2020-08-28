/* Copyright (c) 2020 Cisco and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

document.addEventListener("DOMContentLoaded", function(event) {
  var client = new XMLHttpRequest()
  client.open('GET', 'include/lab-guide.md')
  client.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var converter = new showdown.Converter()
      converter.setFlavor('github')
      var html = converter.makeHtml(client.responseText)
      document.getElementById("page").innerHTML = html
      htmlContents('#toc', {
        top: 1,         // 1-6: biggest header to include in outline
        bottom: 5,      // 1-6: smallest header to include in outline
        addIds: true,   // true/false: add ids to H* that don't have them
        addLinks: true, // true/false: add links to outline?
        listType: 'u',  // 'u' or 'o': (u)nordered or (o)rdered list type
        filter: false   // String or function: CSS style selector to exclude from outline
                        //   or function to filter to pass to Array.filter
      })
      var links = document.getElementsByTagName('a')
      for (var i = 0; i<links.length; i++) {
        if (links[i].getAttribute('href').substring(0,1) != '#') {
          links[i].setAttribute("target", "_blank");
        }
      }
      if (location.hash) {
        var anchor = document.getElementById(location.hash.slice(1));
        if (anchor) anchor.scrollIntoView();
      }
    }
  }
  client.send()
})
