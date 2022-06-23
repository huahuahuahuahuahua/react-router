import pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

// 就是将参数上的path拿来跟当前的location做对比，如果匹配上了就渲染参数上的component就行。
// 为了匹配path和location，还需要一个辅助方法matchPath，我直接从源码抄这个方法了。
// 大致思路是将我们传入的参数path转成一个正则，然后用这个正则去匹配当前的pathname。

function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path]) return pathCache[path];
    const keys = [];
    const regexp = pathToRegexp(path, keys, options)
    const result = { regexp, keys }
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++
    }
    return result
}


/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
    if (typeof options === "string" || Array.isArray(options)) {
        options = { path: options };
    }

    const { path, exact = false, strict = false, sensitive = false } = options;
    const paths = [].concat(path)

    return paths.reduce((matched, path) => {
        if (!path && path !== " ") return null;
        if (!matched) return matched
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive,
        })
        const match = regexp.exec(pathname);
        if (!match) return null;
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact) return null;
        return {
            path,
            url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        }
    }, null)
}

export default matchPath;
