import React from 'react';
import './NewCatalog.css';

export default function NewCatalog(props) {

    return (
<div class="newcatalog">
<h2>Update Catalog</h2>
Use this page to <u>completely replace</u>
the online catalog.
<hr/>
<form method="post" action="/.netlify/functions/updatecatalog" enctype="multipart/form-data">

<br/>Password: &nbsp; <input name="password" size="25"/>
<br/>Filename: &nbsp; <input name="bookdata" type="file"/>
<br/>
<br/>
<input type="submit" name="doit" value="Update catalog"/>
</form>
<br/>
Here is an example of a book entry:
<br/>
<tt>Twain, Mark.  THE GUILDED AGE: A Tale of Today.  Fun to read. Mint.  $15. </tt>
<br/>
<ul>
<li>Use period-space-space between the parts of the entries.</li>
<li>The order must be: Author, TITLE, Description, Price.  Only TITLE and Price are required.</li>
<li>The description can contain ISBN number. To add pictures put <tt>p=i,DSC_0123,DSC_0124</tt> into 
the description.  The "i" is for pictures at "hosting.photobucket", otherwise "i1103.photobucket".</li>
<li>CATEGORY headings must be all UPPERCASE.</li>
<li>Group headings must be mixed case.</li>
<li>Books that belong to a small group must be indented 4 spaces.</li>
<li>Don't put more than one book on a line.</li>
</ul>
You can put tags in your booklist if you want special formatting.
For instance, &lt;b&gt; is the tag for <b>bold</b> and &lt;/b&gt;
is the tag to stop bold.
<br/>
<br/>
Some other tags are
<ul>
<li>&lt;u&gt;<u>underline</u>&lt;/u&gt;</li>
<li>&lt;i&gt;<i>italics</i>&lt;/i&gt;</li>
<li>&lt;br&gt; force new line.  This is useful for making lists.</li>
<li>&lt;font color=red&gt;<font color="red">change color</font>&lt;/font&gt;</li>
</ul>
</div>
    );
}