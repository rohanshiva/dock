package builder

import (
	"encoding/xml"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gorilla/feeds"
	"github.com/rohanshiva/dock/feed-server/internal/store"
)

func BuildFeed(posts []*store.Post) (string, error) {
	spaceHost := os.Getenv("DETA_SPACE_APP_HOSTNAME")
	username := strings.Split(spaceHost, ".")[1]
	feed := &feeds.Feed{
		Title:       spaceHost,
		Link:        &feeds.Link{Href: fmt.Sprintf("https://feeds_%s", spaceHost)},
		Description: "feeds",
		Author:      &feeds.Author{Name: username},
		Created:     time.Now(),
	}

	var feedItems []*feeds.Item
	for i := 0; i < len(posts); i++ {
		item := posts[i]
		var title string
		if len(item.Content) <= 50 {
			title = item.Content
		} else {
			title = item.Content
		}
		feedItems = append(feedItems,
			&feeds.Item{
				Id:          item.Key,
				Title:       title,
				Link:        &feeds.Link{Href: fmt.Sprintf("https://%s/posts/%s", spaceHost, item.Key)},
				Description: "",
				Created:     time.Now(),
			})
	}
	feed.Items = feedItems
	rssFeed := (&feeds.Rss{Feed: feed}).RssFeed()
	xmlRssFeeds := rssFeed.FeedXml()
	data, err := xml.MarshalIndent(xmlRssFeeds, "", "  ")
	if err != nil {
		return "", err
	}

	s := xml.Header[:len(xml.Header)-1] + string(data)
	return s, nil
}
