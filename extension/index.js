"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require("axios");
var path_1 = __importDefault(require("path"));
var twitch_1 = require("twitch");
var twitch_auth_1 = require("twitch-auth");
var twitch_webhooks_1 = require("twitch-webhooks");
var twitch_webhooks_ngrok_1 = require("twitch-webhooks-ngrok");
require("dotenv").config({ path: path_1.default.join(__dirname, "../.env") });
module.exports = function (nodecg) { return __awaiter(void 0, void 0, void 0, function () {
    var clientId, clientSecret, authProvider, apiClient, listener, userId, twitchFollowerReplicant, githubResultsReplicant;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clientId = process.env.TWITCH_CLIENT_ID;
                clientSecret = process.env.TWITCH_CLIENT_SECRET;
                authProvider = new twitch_auth_1.ClientCredentialsAuthProvider(clientId, clientSecret);
                apiClient = new twitch_1.ApiClient({ authProvider: authProvider });
                listener = new twitch_webhooks_1.WebHookListener(apiClient, new twitch_webhooks_ngrok_1.NgrokAdapter());
                userId = 22510310;
                twitchFollowerReplicant = nodecg.Replicant("follower-alert");
                return [4 /*yield*/, listener.subscribeToFollowsToUser(userId, function (helixFollow) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            nodecg.log.info(helixFollow.userDisplayName + " started following!");
                            twitchFollowerReplicant.value = helixFollow.userDisplayName;
                            return [2 /*return*/];
                        });
                    }); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, listener.listen()];
            case 2:
                _a.sent();
                githubResultsReplicant = nodecg.Replicant("github-results");
                nodecg.listenFor("findRepositories", function (query) { return __awaiter(void 0, void 0, void 0, function () {
                    var apiResponse, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                nodecg.log.info("Extension received the value " + query + "!");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, axios.get("https://api.github.com/search/repositories", {
                                        params: {
                                            q: query,
                                        },
                                    })];
                            case 2:
                                apiResponse = _a.sent();
                                nodecg.log.info("Found " + apiResponse.data.total_count + " results from the github api!");
                                githubResultsReplicant.value = apiResponse.data.items;
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                nodecg.log.error(error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
