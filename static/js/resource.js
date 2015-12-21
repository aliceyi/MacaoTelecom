window.RC={};
RC["parseOptions"]=function  (src) {
	 var options = {}, g, f, c, a, e;
    g = /\?(.*)|#(.*)/.exec(src);
    if (g) {
        g = g[0].slice(1).replace("+", " ").split(/[&;]/g);
        for (f = 0; f < g.length; f++) {
            c = g[f].split("=");
            a = decodeURIComponent(c[0]);
            e = "";
            if (c.length != 1) e = decodeURIComponent(c[1]);
            options[a] = e;
        }
    }
	return options;// body...
}