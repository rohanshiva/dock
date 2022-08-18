package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rohanshiva/dock/feed-server/internal/builder"
	"github.com/rohanshiva/dock/feed-server/internal/store"
	"log"
)

func main() {

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		store, err := store.NewStoreService()
		if err != nil {
			log.Fatal(err)
		}

		posts, err := store.FetchPosts()
		if err != nil {
			log.Fatal(err)
		}

		feed, err := builder.BuildFeed(posts)
		if err != nil {
			log.Fatal(err)
		}
		return c.SendString(feed)
	})

	log.Fatal(app.Listen(":8080"))

}
