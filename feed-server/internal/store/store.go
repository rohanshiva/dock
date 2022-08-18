package store

import (
	"fmt"

	"github.com/deta/deta-go/deta"
	"github.com/deta/deta-go/service/base"
)

type Post struct {
	Key     string `json:"key"`
	Content string `json:"content"`
}

type StoreService struct {
	detaClient *deta.Deta
	baseClient *base.Base
}

func NewStoreService() (*StoreService, error) {
	d, err := deta.New()
	if err != nil {
		return nil, fmt.Errorf("failed to init new Deta instance: %w", err)
	}

	db, err := base.New(d, "dock_posts")
	if err != nil {
		return nil, fmt.Errorf("failed to init new Base instance: %w", err)
	}

	return &StoreService{detaClient: d, baseClient: db}, nil
}

func (s *StoreService) FetchPosts() ([]*Post, error) {
	var results []*Post

	// variable to store the page
	var page []*Post

	// fetch input
	i := &base.FetchInput{
		Q:     base.Query{},
		Dest:  &page,
		Limit: 1, // limit provided so each page will only have one item
	}

	// fetch items
	lastKey, err := s.baseClient.Fetch(i)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch items: %w", err)
	}

	// append page items to results
	results = append(results, page...)

	// get all pages
	for lastKey != "" {
		// provide the last key in the fetch input
		i.LastKey = lastKey

		// fetch
		lastKey, err = s.baseClient.Fetch(i)
		if err != nil {
			fmt.Println("failed to fetch items:", err)
			return nil, fmt.Errorf("failed to fetch items: %w", err)
		}

		// append page items to all results
		results = append(results, page...)
	}
	return results, nil
}
