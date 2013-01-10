module.exports = 
  "<p>Asynchronous file open. See open(2). <code>flags</code> can be:\n\n</p>" + 
  "<ul>" + 
    "<li><p><code>'r'</code> - Open file for reading.\nAn exception occurs if the file does not exist.</p>\n</li>" +
    "<li><p><code>'r+'</code> - Open file for reading and writing.\nAn exception occurs if the file does not exist.</p>\n</li>\n" + 
    "<li><p><code>'rs'</code> - Open file for reading in synchronous mode. Instructs the operating\nsystem to bypass the local file system cache.</p>\n" + 
      "<p>This is primarily useful for opening files on NFS mounts as it allows you to\nskip the potentially stale local cache. It has a very real impact on I/O\n" + 
        "performance so don't use this mode unless you need it.</p>\n" + 
      "<p>Note that this doesn't turn <code>fs.open()</code> into a synchronous blocking call.\n" + 
        "If that's what you want then you should be using <code>fs.openSync()</code></p>\n</li>\n" + 
    "<li><p><code>'rs+'</code> - Open file for reading and writing, telling the OS to open it\nsynchronously. See notes for <code>'rs'</code> about using this with caution.</p>\n</li>\n" + 
    "<li><p><code>'w'</code> - Open file for writing.\nThe file is created (if it does not exist) or truncated (if it exists).</p>\n</li>\n" + 
    "<li><p><code>'wx'</code> - Like <code>'w'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "<li><p><code>'w+'</code> - Open file for reading and writing.\nThe file is created (if it does not exist) or truncated (if it exists).</p>\n</li>\n" + 
    "<li><p><code>'wx+'</code> - Like <code>'w+'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "<li><p><code>'a'</code> - Open file for appending.\nThe file is created if it does not exist.</p>\n</li>\n" + 
    "<li><p><code>'ax'</code> - Like <code>'a'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "<li><p><code>'a+'</code> - Open file for reading and appending.\nThe file is created if it does not exist.</p>\n</li>\n" + 
    "<li><p><code>'ax+'</code> - Like <code>'a+'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "</ul>\n" + 
    "<p><code>mode</code> defaults to <code>0666</code>. The callback gets two arguments <code>(err, fd)</code>.\n\n</p>\n" + 
    "<p>Exclusive mode (<code>O_EXCL</code>) ensures that <code>path</code> is newly created. <code>fs.open()</code>\n" + 
    "fails if a file by that name already exists. On POSIX systems, symlinks are\n" + 
    "not followed. Exclusive mode may or may not work with network file systems.\n\n</p>\n";
